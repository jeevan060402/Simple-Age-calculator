package main

import (
	"age-calculator-backend/database"
	"age-calculator-backend/routes"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db := database.InitDatabase()
	defer db.Close()

	// Initialize Gin router
	r := gin.Default()

	// Setup routes
	routes.SetupRoutes(r, db)

	// Start the server
	fmt.Println("Server running on http://localhost:8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
