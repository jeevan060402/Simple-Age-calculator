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
		_, err = db.Exec("INSERT INTO history (dob, calculated_age) VALUES (?, ?)", request.DOB, age)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
			return
		}

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
		rows, err := db.Query("SELECT id, dob, calculated_age, timestamp FROM history ORDER BY timestamp DESC")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history"})
			return
		}
		defer rows.Close()

		var history []models.History
		for rows.Next() {
			var h models.History
			if err := rows.Scan(&h.ID, &h.DOB, &h.CalculatedAge, &h.Timestamp); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse history data"})
				return
			}
			history = append(history, h)
		}

		c.JSON(http.StatusOK, history)
	}
}
