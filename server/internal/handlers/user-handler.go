package handlers

import (
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	validate *validator.Validate
	service  *services.UserService
}

func MakeUserHandler(v *validator.Validate, s *services.UserService) UserHandler {
	return UserHandler{validate: v, service: s}
}

func (handler *UserHandler) Register(c *fiber.Ctx) error {
	input := RegisterRequest{}

	if err := c.BodyParser(&input); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if err := handler.validate.Struct(input); err != nil {
		return c.Status(http.StatusBadRequest).SendString(err.Error())
	}

	if err := handler.service.RegisterUser(input.Firstname, input.Lastname, input.Username, input.Password); err != nil {
		return c.Status(http.StatusInternalServerError).SendString(err.Error())
	}

	return c.SendStatus(http.StatusOK)
}
