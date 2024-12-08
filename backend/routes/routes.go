package routes

import (
	"age-calculator-backend/handlers"
	"database/sql"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures the API endpoints
func SetupRoutes(r *gin.Engine, db *sql.DB) {
	r.POST("/calculate-age", handlers.CalculateAgeHandler(db))
	r.GET("/history", handlers.GetHistoryHandler(db))
}
