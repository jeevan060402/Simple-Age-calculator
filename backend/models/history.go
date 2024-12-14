package models

type History struct {
	ID        int    `json:"id"`
	Tool      string `json:"tool"`       // Name of the tool used (Age Calculator, BMI Calculator)
	InputData string `json:"input_data"` // The input data provided by the user
	Result    string `json:"result"`     // The result calculated
	Timestamp string `json:"timestamp"`  // The timestamp of the entry
}
