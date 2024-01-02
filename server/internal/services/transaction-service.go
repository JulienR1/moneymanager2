package services

import (
	"JulienR1/moneymanager2/server/internal/dtos"
	"JulienR1/moneymanager2/server/internal/repositories"
	"errors"
	"fmt"
	"time"
)

type TransactionService struct {
	repository      *repositories.TransactionRepository
	userService     *UserService
	fileService     *FileService
	categoryService *CategoryService
}

func MakeTransactionService(repository *repositories.TransactionRepository, userService *UserService, fileService *FileService, categoryService *CategoryService) TransactionService {
	return TransactionService{repository: repository, userService: userService, fileService: fileService, categoryService: categoryService}
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

func (service *TransactionService) GetTransactions(dashboardId int) ([]dtos.TransactionDto, error) {
	transactions, err := service.repository.FindTransactions(dashboardId)
	if err != nil {
		return []dtos.TransactionDto{}, fmt.Errorf("could not get transactions for dashboard (id = %d)", dashboardId)
	}

	result := make([]dtos.TransactionDto, len(transactions))
	for index, transaction := range transactions {
		dto, err := service.parseTransaction(&transaction)
		if err != nil {
			return []dtos.TransactionDto{}, err
		}
		result[index] = *dto
	}

	return result, nil
}

func (service *TransactionService) GetTransaction(dashboardId, transactionId int) (*dtos.TransactionDto, error) {
	transaction, err := service.repository.FindTransaction(dashboardId, transactionId)
	if err != nil {
		return nil, fmt.Errorf("could not get transaction (id = %d) for dashboard (id = %d)", transactionId, dashboardId)
	}
	return service.parseTransaction(transaction)
}

func (service *TransactionService) parseTransaction(transaction *repositories.TransactionRecord) (*dtos.TransactionDto, error) {
	user, err := service.userService.FindUserById(transaction.UserId)
	if err != nil {
		return nil, fmt.Errorf("could not find user (id = %d) associated with transaction (id = %d)", transaction.UserId, transaction.Id)
	}

	category, err := service.categoryService.GetAssociatedWithDashboardById(transaction.DashboardId, transaction.CategoryId)
	if err != nil {
		return nil, fmt.Errorf("could not find category (id = %d) associated with transaction (id = %d)", transaction.CategoryId, transaction.Id)
	}

	var receipt *dtos.FileDto = nil
	if transaction.ReceiptId != nil {
		receipt, err = service.fileService.GetFile(*transaction.ReceiptId)
		if err != nil {
			return nil, fmt.Errorf("could not find receipt (id = %d) associated with transaction (id = %d)", *transaction.ReceiptId, transaction.Id)
		}
	}

	return &dtos.TransactionDto{
		Id:        transaction.Id,
		Label:     transaction.Label,
		Amount:    transaction.Amount,
		User:      *user,
		Receipt:   receipt,
		Category:  *category,
		Timestamp: transaction.Date,
	}, nil
}
