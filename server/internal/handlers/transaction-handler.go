package handlers

import (
	datauri "JulienR1/moneymanager2/server/internal/pkg/data-uri"
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type TransactionHandler struct {
	validate         *validator.Validate
	service          *services.TransactionService
	fileService      *services.FileService
	categoryService  *services.CategoryService
	dashboardService *services.DashboardService
}

type NewTransactionRequest struct {
	Type            string    `json:"type" validate:"required"`
	Label           string    `json:"label" validate:"required,max=128"`
	Amount          float64   `json:"amount" validate:"required,min=0,numeric"`
	Receipt         *string   `json:"receipt,omitempty" validate:"omitempty,datauri"`
	TransactionDate time.Time `json:"date" validate:"required"`
	CategoryId      int       `json:"categoryId" validate:"required,numeric,min=0"`
}

func MakeTransactionHandler(v *validator.Validate, s *services.TransactionService, fileService *services.FileService, categoryService *services.CategoryService, dashboardService *services.DashboardService) TransactionHandler {
	return TransactionHandler{validate: v, service: s, fileService: fileService, categoryService: categoryService, dashboardService: dashboardService}
}

func (handler *TransactionHandler) CreateTransaction(c *fiber.Ctx) error {
	input := NewTransactionRequest{}

	if err := c.BodyParser(&input); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if err := handler.validate.Struct(input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(err))
	}

	isExpense := input.Type == "expense"
	isIncome := input.Type == "income"
	if !isExpense && !isIncome {
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(errors.New("invalid transaction type")))
	}

	dashboardIdStr := c.Params("dashboardId")
	dashboardId, err := strconv.Atoi(dashboardIdStr)
	if err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if handler.categoryService.GetAssociatedWithDashboardById(dashboardId, input.CategoryId); err != nil {
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(err))
	}

	userId := c.Locals("userId").(int)
	if !handler.dashboardService.IsDashboardAssociatedWithUser(dashboardId, userId) {
		return c.
			Status(http.StatusBadRequest).
			JSON(jsonutils.NewError(errors.New("invalid dashboard")))
	}

	var receiptId *int = nil
	if input.Receipt != nil {
		uri, err := datauri.New(*input.Receipt)
		if err != nil {
			return c.
				Status(http.StatusBadRequest).
				JSON(jsonutils.NewError(errors.New("invalid receipt data uri")))
		}

		id, err := handler.fileService.StoreFile(uri)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
		}
		receiptId = &id
	}

	result, err := handler.service.SaveTransaction(isExpense, input.Label, input.Amount, input.TransactionDate, dashboardId, userId, input.CategoryId, receiptId)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(result)
}

func (handler *TransactionHandler) CreateRefund(c *fiber.Ctx) error {
	return c.SendStatus(http.StatusNotImplemented)
}
