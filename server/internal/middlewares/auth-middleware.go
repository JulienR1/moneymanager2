package middlewares

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	"JulienR1/moneymanager2/server/internal/services"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
)

func MakeAuthMiddleware(authService *services.AuthService, userService *services.UserService) func(*fiber.Ctx) error {
	validateAuth := func(c *fiber.Ctx, key string) (bool, error) {
		userId, err := authService.Authenticate(key[7:]) // [7:] --> Remove "Bearer "

		if err != nil {
			return false, keyauth.ErrMissingOrMalformedAPIKey
		}

		user, err := userService.FindUserById(userId)
		if user == nil || err != nil {
			return false, c.Status(http.StatusBadRequest).JSON(jsonutils.NewError(errors.New("invalid user")))
		}

		c.Locals("userId", userId)
		return true, nil
	}

	return keyauth.New(keyauth.Config{
		KeyLookup: "header:Authorization",
		Validator: validateAuth,
	})
}
