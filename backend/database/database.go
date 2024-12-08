package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite" // SQLite driver
)

// InitDatabase initializes the SQLite database and creates the table if not exists
func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite", "age_calculator.db")
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	createTableQuery := `
	CREATE TABLE IF NOT EXISTS history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		dob TEXT NOT NULL,
		calculated_age TEXT NOT NULL,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	_, err = db.Exec(createTableQuery)
	if err != nil {
		log.Fatal("Error creating table:", err)
	}

	log.Println("Database initialized successfully")
	return db
}
