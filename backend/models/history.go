package models

// History represents the structure of the history table
type History struct {
	ID            int    `json:"id"`
	DOB           string `json:"dob"`
	CalculatedAge string `json:"calculated_age"`
	Timestamp     string `json:"timestamp"`
}
