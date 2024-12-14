package routes

import (
	"age-calculator-backend/handlers"
	"database/sql"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API endpoints
func SetupRoutes(r *gin.Engine, db *sql.DB) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "Server is running!"})
	})
	// Age Calculator Route
	r.POST("/calculate-age", handlers.CalculateAgeHandler(db))
	// BMI Calculator Route
	r.POST("/calculate-bmi", handlers.CalculateBMIHandler(db))
	// Get History Route
	r.GET("/history", handlers.GetHistoryHandler(db))
}
