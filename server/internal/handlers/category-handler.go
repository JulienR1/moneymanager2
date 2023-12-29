package handlers

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type CategoryHandler struct {
	validate         *validator.Validate
	service          *services.CategoryService
	dashboardService *services.DashboardService
}

type NewCategoryRequest struct {
	Label    string `json:"label" validate:"required,max=128"`
	Color    string `json:"color" validate:"required,max=7"`
	IconName string `json:"icon" validate:"required,max=64"`
}

func MakeCategoryHandler(v *validator.Validate, s *services.CategoryService, dashboardService *services.DashboardService) CategoryHandler {
	return CategoryHandler{validate: v, service: s, dashboardService: dashboardService}
}

func (handler *CategoryHandler) CreateCategory(c *fiber.Ctx) error {
	input := NewCategoryRequest{}
	dashboardId := c.Locals("dashboardId").(int)

	if err := c.BodyParser(&input); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if err := handler.validate.Struct(input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(err))
	}

	newCategory, err := handler.service.AddCategory(dashboardId, input.Label, input.Color, input.IconName)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(newCategory)
}
