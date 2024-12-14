package database

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite" // SQLite driver
)

func InitDatabase() *sql.DB {
	db, err := sql.Open("sqlite", "age_calculator.db")
	if err != nil {
		log.Fatal("Error opening database:", err)
	}

	// Create the history table (for Age and BMI calculations)
	createHistoryTable := `
	CREATE TABLE IF NOT EXISTS history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		tool TEXT NOT NULL CHECK(tool IN ('Age Calculator', 'BMI Calculator')),
		input_data TEXT NOT NULL,
		result TEXT NOT NULL,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	// Create the test_runs table
	createTestRunsTable := `
	CREATE TABLE IF NOT EXISTS test_runs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		total_tests INTEGER NOT NULL,
		success_count INTEGER NOT NULL,
		failure_count INTEGER NOT NULL,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	// Create the test_failures table (linked to test_runs)
	createTestFailuresTable := `
	CREATE TABLE IF NOT EXISTS test_failures (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		test_run_id INTEGER NOT NULL,
		path TEXT NOT NULL,
		payload TEXT NOT NULL,
		reason TEXT NOT NULL,
		FOREIGN KEY (test_run_id) REFERENCES test_runs(id)
	);`

	// Execute table creation queries
	queries := []string{createHistoryTable, createTestRunsTable, createTestFailuresTable}
	for _, query := range queries {
		_, err = db.Exec(query)
		if err != nil {
			log.Fatalf("Error creating table: %v", err)
		}
	}

	log.Println("Database initialized successfully for tests and calculations.")
	return db
}
