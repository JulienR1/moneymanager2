package middlewares

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"errors"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func MakeDashboardMiddleware(dashboardService *services.DashboardService) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userId := c.Locals("userId").(int)
		dashboardIdStr := c.Params("dashboardId")

		dashboardId, err := strconv.Atoi(dashboardIdStr)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(errors.New("could not get dashboard id")))
		}

		if _, err := dashboardService.GetById(dashboardId); err != nil {
			return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(errors.New("invalid dashboard id")))
		}

		if !dashboardService.IsDashboardAssociatedWithUser(dashboardId, userId) {
			return c.Status(http.StatusUnauthorized).JSON(jsonutils.NewError(errors.New("access denied")))
		}

		c.Locals("dashboardId", dashboardId)
		return c.Next()
	}
}
