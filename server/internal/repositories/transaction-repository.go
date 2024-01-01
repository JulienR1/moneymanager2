package repositories

import (
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"database/sql"
	"time"
)

type TransactionRepository struct {
	db *repoutils.Database
}

type TransactionRecord struct {
	Id          int
	Label       string
	Amount      float64
	Date        time.Time
	ReceiptId   *int
	UserId      int
	CategoryId  int
	DashboardId int
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

func (repository *TransactionRepository) FindTransactions(dashboardId int) ([]TransactionRecord, error) {
	query := "SELECT id, label, amount, date, receipt_id, user_id, category_id, dashboard_id FROM transactions WHERE dashboard_id = $1"

	rows, err := repository.db.Connection.Query(query, dashboardId)
	if err != nil {
		return []TransactionRecord{}, err
	}

	defer rows.Close()
	result := []TransactionRecord{}

	for rows.Next() {
		record := TransactionRecord{}
		scanTransaction(rows, &record)
		result = append(result, record)
	}

	return result, nil
}

func (repository *TransactionRepository) FindTransaction(dashboardId, transactionId int) (*TransactionRecord, error) {
	query := "SELECT id, label, amount, date, receipt_id, user_id, category_id, dashboard_id FROM transactions WHERE dashboard_id = $1 AND id = $2"

	var result TransactionRecord
	row := repository.db.Connection.QueryRow(query, dashboardId, transactionId)
	if err := scanTransaction(row, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

type row interface {
	Scan(dest ...any) error
}

func scanTransaction(row row, record *TransactionRecord) error {
	return row.Scan(
		&record.Id,
		&record.Label,
		&record.Amount,
		&record.Date,
		&record.ReceiptId,
		&record.UserId,
		&record.CategoryId,
		&record.DashboardId,
	)
}
