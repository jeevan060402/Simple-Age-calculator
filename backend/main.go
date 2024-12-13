package main

import (
	"age-calculator-backend/database"
	"age-calculator-backend/routes"
	"fmt"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db := database.InitDatabase()
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// CORS configuration (allow requests from your frontend)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                   // Allow React app running on localhost:3000
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},            // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"}, // Allowed headers
		AllowCredentials: true,                                                // Enable credentials (cookies, authorization tokens)
		MaxAge:           12 * time.Hour,                                      // Cache the preflight response for 12 hours
	}))

	// Setup routes
	routes.SetupRoutes(r, db)

	// Start the server
	fmt.Println("Server running on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
