package dtos

import "time"

type NewTransactionDto struct {
	Id int `json:"id"`
}

type TransactionDto struct {
	Id        int         `json:"id"`
	Label     string      `json:"label"`
	Amount    float64     `json:"amount"`
	User      UserDto     `json:"user"`
	Category  CategoryDto `json:"category"`
	Receipt   *FileDto    `json:"receipt"`
	Timestamp time.Time   `json:"timestamp"`
}
