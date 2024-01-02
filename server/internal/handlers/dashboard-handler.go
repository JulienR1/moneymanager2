package handlers

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type DashboardHandler struct {
	validate    *validator.Validate
	service     *services.DashboardService
	userService *services.UserService
}

func MakeDashboardHandler(v *validator.Validate, s *services.DashboardService, userService *services.UserService) DashboardHandler {
	return DashboardHandler{validate: v, service: s, userService: userService}
}

func (handler *DashboardHandler) GetUsers(c *fiber.Ctx) error {
	dashboardId := c.Locals("dashboardId").(int)
	users, err := handler.service.GetAssociatedUsers(dashboardId)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(users)
}

func (handler *DashboardHandler) GetAllDashboardsForUser(c *fiber.Ctx) error {
	userId := c.Locals("userId").(int)
	dashboards, err := handler.service.GetAllByUserId(userId)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(dashboards)
}

func (handler *DashboardHandler) GetDashboardForUser(c *fiber.Ctx) error {
	dashboardId := c.Locals("dashboardId").(int)
	dashboard, err := handler.service.GetById(dashboardId)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(dashboard)

}
