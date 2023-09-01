package handlers

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	validate      *validator.Validate
	service       *services.AuthService
	tokenService  *services.TokenService
	cookieService *services.CookieService
}

type LoginRequest struct {
	Username string `json:"username" validate:"required,email"`
	Password string `json:"password" validate:"required,max=72"`
}

type RegisterRequest struct {
	Firstname string `json:"firstname" validate:"required,max=64"`
	Lastname  string `json:"lastname" validate:"required,max=64"`
	Username  string `json:"username" validate:"required,max=128,email"`
	Password  string `json:"password" validate:"required,max=72"` // TODO: add extra requirements on password
}

type AccessPayload struct {
	AccessToken string `json:"accessToken"`
}

func MakeAuthHandler(v *validator.Validate, s *services.AuthService, t *services.TokenService, c *services.CookieService) AuthHandler {
	return AuthHandler{validate: v, service: s, tokenService: t, cookieService: c}
}

func (handler *AuthHandler) Login(c *fiber.Ctx) error {
	input := LoginRequest{}

	if err := c.BodyParser(&input); err != nil {
		return c.SendStatus(http.StatusBadRequest)
	}

	if err := handler.validate.Struct(input); err != nil {
		return c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(err))
	}

	accessToken, err := handler.service.Login(input.Username, input.Password)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(jsonutils.NewError(err))
	}

	refreshToken, err := handler.tokenService.GenerateRefreshToken()
	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	c.Cookie(handler.cookieService.MakeRefreshTokenCookie(refreshToken))
	return c.JSON(AccessPayload{AccessToken: accessToken})
}

func (handler *AuthHandler) RefreshAccessToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies(services.REFRESH_TOKEN)
	if refreshToken == "" {
		return c.SendStatus(http.StatusUnauthorized)
	}

	if _, err := handler.tokenService.ValidateToken(refreshToken); err != nil {
		return c.SendStatus(http.StatusUnauthorized)
	}

	userId := c.Locals("userId").(int)
	accessToken, err := handler.tokenService.GenerateAccessToken(userId)
	if err != nil {
		return c.SendStatus(http.StatusInternalServerError)
	}

	c.Cookie(handler.cookieService.MakeRefreshTokenCookie(refreshToken))
	return c.JSON(AccessPayload{AccessToken: accessToken})
}

func (handler *AuthHandler) Logout(c *fiber.Ctx) error {
	c.Cookie(handler.cookieService.MakeRefreshTokenClearingCookie())
	return c.SendStatus(http.StatusOK)
}
