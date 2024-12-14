package handlers

import (
	"age-calculator-backend/models"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// CalculateAgeHandler calculates age and saves it to the database
func CalculateAgeHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request struct {
			DOB string `json:"dob"`
		}

		// Parse incoming JSON request
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Validate and parse DOB
		dob, err := time.Parse("2006-01-02", request.DOB)
		if err != nil || dob.After(time.Now()) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or future date"})
			return
		}

		// Calculate age
		age := calculateAge(dob)

		// Save to database
		_, err = db.Exec(
			"INSERT INTO history (tool, input_data, result) VALUES (?, ?, ?)",
			"Age Calculator",                    // Tool name
			fmt.Sprintf("DOB: %s", request.DOB), // Input data
			age,                                 // Calculated result
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
			return
		}

		// Return the calculated age
		c.JSON(http.StatusOK, gin.H{"age": age})
	}
}

func calculateAge(dob time.Time) string {
	now := time.Now()
	years := now.Year() - dob.Year()
	months := int(now.Month() - dob.Month())
	days := now.Day() - dob.Day()

	if days < 0 {
		months--
		days += 30
	}
	if months < 0 {
		years--
		months += 12
	}

	return fmt.Sprintf("%d years, %d months, %d days", years, months, days)
}

// GetHistoryHandler fetches all history records
func GetHistoryHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Query all records, ordered by timestamp descending
		rows, err := db.Query("SELECT id, tool, input_data, result, timestamp FROM history ORDER BY timestamp DESC")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
			return
		}
		defer rows.Close()

		var history []models.History
		for rows.Next() {
			var h models.History
			// Scan the data into the History struct
			if err := rows.Scan(&h.ID, &h.Tool, &h.InputData, &h.Result, &h.Timestamp); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse history data"})
				return
			}
			history = append(history, h)
		}

		// Return the history as JSON
		c.JSON(http.StatusOK, history)
	}
}

// BMICalculationRequest defines the expected request payload
type BMICalculationRequest struct {
	Weight float64 `json:"weight"` // Weight in kilograms
	Height float64 `json:"height"` // Height in meters
}

// CalculateBMIHandler calculates BMI and saves it to the database
func CalculateBMIHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var request BMICalculationRequest

		// Parse incoming JSON request
		if err := c.ShouldBindJSON(&request); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		// Validate inputs
		if request.Weight <= 0 || request.Height <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Weight and height must be positive values"})
			return
		}

		// Calculate BMI: BMI = weight / (height^2)
		bmi := request.Weight / (request.Height * request.Height)
		result := fmt.Sprintf("%.2f", bmi)

		// Save to database
		_, err := db.Exec(
			"INSERT INTO history (tool, input_data, result) VALUES (?, ?, ?)",
			"BMI Calculator", // Tool name
			fmt.Sprintf("Weight: %.2f, Height: %.2f", request.Weight, request.Height), // Input data
			result, // BMI result
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data to database"})
			return
		}

		// Return the calculated BMI
		c.JSON(http.StatusOK, gin.H{
			"bmi": result,
		})
	}
}
