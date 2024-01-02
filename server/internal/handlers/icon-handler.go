package handlers

import (
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type IconHandler struct {
	service *services.IconService
}

func MakeIconHandler(s *services.IconService) IconHandler {
	return IconHandler{service: s}
}

func (handler *IconHandler) GetIcons(c *fiber.Ctx) error {
	icons, err := handler.service.GetIcons()
	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}
	return c.Status(http.StatusOK).JSON(icons)
}
