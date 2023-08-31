package handlers

import (
	"JulienR1/moneymanager2/server/internal/repositories"
	"JulienR1/moneymanager2/server/internal/services"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
)

func RegisterRoutes(app *fiber.App) {
	validator := validator.New()

	userRepository := repositories.UserRepository{}

	userService := services.MakeUserService(&userRepository)
	tokenService := services.MakeTokenService()
	cookieService := services.MakeCookieService()
	authService := services.MakeAuthService(&tokenService, &userRepository)

	authHandler := MakeAuthHandler(validator, &authService, &tokenService, &cookieService)
	userHandler := MakeUserHandler(validator, &userService)

	authMiddleware := makeAuthMiddleware(&authHandler)

	app.Get("/", rootController)

	auth := app.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Use(authMiddleware).Post("/refresh", authHandler.RefreshAccessToken)

	users := app.Group("/users").Use(authMiddleware)
	users.Post("/register", userHandler.Register)
	users.Get("/:userId", userHandler.GetUser)
}

func rootController(c *fiber.Ctx) error {
	return c.SendString("Server is running")
}

func makeAuthMiddleware(authHandler *AuthHandler) func(*fiber.Ctx) error {
	validateAuth := func(c *fiber.Ctx, key string) (bool, error) {
		userId, err := authHandler.service.Authenticate(key[7:]) // [7:] --> Remove "Bearer "

		if err != nil {
			return false, keyauth.ErrMissingOrMalformedAPIKey
		}

		c.Locals("userId", userId)
		return true, nil
	}

	return keyauth.New(keyauth.Config{
		KeyLookup: "header:Authorization",
		Validator: validateAuth,
	})
}
