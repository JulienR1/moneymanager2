package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"
	"time"
)

type TransactionService struct {
	repository *repositories.TransactionRepository
}

func MakeTransactionService(repository *repositories.TransactionRepository) TransactionService {
	return TransactionService{repository: repository}
}

func (service *TransactionService) SaveTransaction(isExpense bool, label string, amount float64, date time.Time, dashboardId, userId, categoryId int, receiptId *int) (*dtos.NewTransactionDto, error) {
	var amountFactor float64 = 1
	if isExpense {
		amountFactor = -1
	}

	transactiondId, err := service.repository.CreateTransaction(label, amount*amountFactor, date, dashboardId, userId, categoryId, receiptId)
	if err != nil {
		return nil, errors.New("could not create the transaction")
	}

	return &dtos.NewTransactionDto{Id: transactiondId}, nil
}
