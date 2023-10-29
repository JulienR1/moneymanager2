package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"time"
)

type TransactionRepository struct {
	db *repoutils.Database
}

func MakeTransactionRepository(db *repoutils.Database) TransactionRepository {
	return TransactionRepository{db: db}
}

func (repository *TransactionRepository) CreateTransaction(label string, amount float64, date time.Time, dashboardId, userId, categoryId int, receiptId *int) (int, error) {
	query := "INSERT INTO transactions (label, amount, date, dashboard_id, user_id, category_id, receipt_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id"

	var transactionId int
	row := repository.db.Connection.QueryRow(query, label, amount, date, dashboardId, userId, categoryId, receiptId)
	if err := row.Scan(&transactionId); err != nil {
		return 0, err
	}

	return transactionId, nil
}
