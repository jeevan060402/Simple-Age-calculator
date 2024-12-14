package handlers

import (
	"age-calculator-backend/database"
	"bytes"
	"database/sql"
	"encoding/json"
	"math/rand"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

func setup() {
	db = database.InitDatabase()
}

func tearDown() {
	db.Close()
}

func setupRouter(db *sql.DB) *gin.Engine {
	router := gin.Default()

	// Register routes (using the handlers)
	router.POST("/calculate-age", CalculateAgeHandler(db))
	router.POST("/calculate-bmi", CalculateBMIHandler(db))
	router.GET("/history", GetHistoryHandler(db))

	return router
}

// RandomDOB generates a random date of birth
func RandomDOB() string {
	start := time.Date(1950, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC)
	delta := end.Sub(start)
	randomDays := rand.Int63n(int64(delta.Hours() / 24))
	randomDate := start.Add(time.Duration(randomDays) * 24 * time.Hour)
	return randomDate.Format("2006-01-02")
}

// RandomWeightAndHeight generates random weight (40–150 kg) and height (1.2–2.5 m)
func RandomWeightAndHeight() (float64, float64) {
	weight := 40 + rand.Float64()*(150-40)   // Random weight between 40 and 150
	height := 1.2 + rand.Float64()*(2.5-1.2) // Random height between 1.2m and 2.5m
	return weight, height
}

func logTestRun(total, success, failure int) int64 {
	result, _ := db.Exec("INSERT INTO test_runs (total_tests, success_count, failure_count) VALUES (?, ?, ?)",
		total, success, failure)
	id, _ := result.LastInsertId()
	return id
}

func logFailure(testRunID int64, path, payload, reason string) {
	db.Exec("INSERT INTO test_failures (test_run_id, path, payload, reason) VALUES (?, ?, ?, ?)",
		testRunID, path, payload, reason)
}

func TestEndpoints(t *testing.T) {
	setup()
	defer tearDown()

	router := setupRouter(db) // Assume routes are properly configured

	totalTests := 4
	successCount := 0
	failureCount := 0
	testRunID := logTestRun(totalTests, successCount, failureCount)

	// Test Age Calculator
	t.Run("AgeCalculator", func(t *testing.T) {
		tests := []struct {
			name       string
			dob        string
			expected   int
			shouldFail bool
		}{
			{"Valid DOB", RandomDOB(), http.StatusOK, false},
			{"Invalid DOB", "invalid-date", http.StatusBadRequest, true},
		}

		for _, test := range tests {
			payload := map[string]string{"dob": test.dob}
			jsonPayload, _ := json.Marshal(payload)

			req, _ := http.NewRequest("POST", "/calculate-age", bytes.NewBuffer(jsonPayload))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code == test.expected && !test.shouldFail {
				successCount++
			} else if w.Code != test.expected {
				failureCount++
				logFailure(testRunID, "/calculate-age", string(jsonPayload), w.Body.String())
			}
		}
	})

	// Test BMI Calculator
	t.Run("BMICalculator", func(t *testing.T) {
		tests := []struct {
			name       string
			weight     float64
			height     float64
			expected   int
			shouldFail bool
		}{
			{"Zero Weight", 0, 1.75, http.StatusBadRequest, true},
			{"Zero Height", 70, 0, http.StatusBadRequest, true},
			{"Negative Weight", -70, 1.75, http.StatusBadRequest, true},
		}

		// Add a valid random case by unpacking RandomWeightAndHeight
		weight, height := RandomWeightAndHeight()
		tests = append(tests, struct {
			name       string
			weight     float64
			height     float64
			expected   int
			shouldFail bool
		}{
			"Valid Weight and Height", weight, height, http.StatusOK, false,
		})

		for _, test := range tests {
			payload := map[string]interface{}{
				"weight": test.weight,
				"height": test.height,
			}
			jsonPayload, _ := json.Marshal(payload)

			req, _ := http.NewRequest("POST", "/calculate-bmi", bytes.NewBuffer(jsonPayload))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code == test.expected && !test.shouldFail {
				successCount++
			} else if w.Code != test.expected {
				failureCount++
				logFailure(testRunID, "/calculate-bmi", string(jsonPayload), w.Body.String())
			}
		}
	})

	// Update test run summary in the database
	db.Exec("UPDATE test_runs SET success_count = ?, failure_count = ? WHERE id = ?",
		successCount, failureCount, testRunID)

	t.Logf("Test Run ID: %d, Total: %d, Success: %d, Failure: %d", testRunID, totalTests, successCount, failureCount)
}
