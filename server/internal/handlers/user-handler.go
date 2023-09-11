package handlers

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	validate *validator.Validate
	service  *services.UserService
}

type RegisterRequest struct {
	Firstname string `json:"firstname" validate:"required,max=64"`
	Lastname  string `json:"lastname" validate:"required,max=64"`
	Username  string `json:"username" validate:"required,max=256,email"`
	Password  string `json:"password" validate:"required,max=72,password"`
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
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(err))
	}

	userPayload, err := handler.service.RegisterUser(input.Firstname, input.Lastname, input.Username, input.Password)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(jsonutils.NewError(err))
	}

	return c.Status(http.StatusOK).JSON(userPayload)
}

func (handler *UserHandler) GetUser(c *fiber.Ctx) error {
	userIdStr := c.Params("userId")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	user, err := handler.service.FindUserById(userId)
	if err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	return c.Status(http.StatusOK).JSON(user)
}
