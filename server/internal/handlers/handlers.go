package handlers

import (
	jsonutils "JulienR1/moneymanager2/server/internal/pkg/json-utils"
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"JulienR1/moneymanager2/server/internal/repositories"
	"JulienR1/moneymanager2/server/internal/services"
	"JulienR1/moneymanager2/server/internal/validators"
	"errors"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
)

func RegisterRoutes(app *fiber.App, db *repoutils.Database) {
	validator := validator.New()
	validator.RegisterValidation("password", validators.ValidatePassword)

	userRepository := repositories.MakeUserRepository(db)
	iconRepository := repositories.MakeIconRepository(db)
	fileRepository := repositories.MakeFileRepository(db)
	dashboardRepository := repositories.MakeDashboardRepository(db)
	categoryRepository := repositories.MakeCategoryRepository(db)
	transactionRepository := repositories.MakeTransactionRepository(db)

	tokenService := services.MakeTokenService()
	cookieService := services.MakeCookieService()
	fileService := services.MakeFileService(&fileRepository)
	authService := services.MakeAuthService(&tokenService, &userRepository)
	userService := services.MakeUserService(&userRepository, &dashboardRepository, db)
	categoryService := services.MakeCategoryService(&categoryRepository, &iconRepository)
	dashboardService := services.MakeDashboardService(&dashboardRepository, &categoryService)
	transactionService := services.MakeTransactionService(&transactionRepository)

	userHandler := MakeUserHandler(validator, &userService)
	categoryHandler := MakeCategoryHandler(validator, &categoryService, &dashboardService)
	authHandler := MakeAuthHandler(validator, &authService, &tokenService, &cookieService)
	dashboardHandler := MakeDashboardHandler(validator, &dashboardService, &userService)
	transactionHandler := MakeTransactionHandler(validator, &transactionService, &fileService, &categoryService, &dashboardService)

	authMiddleware := makeAuthMiddleware(&authHandler, &userHandler)

	app.Get("/", rootController)

	auth := app.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Use(authMiddleware).Post("/refresh", authHandler.RefreshAccessToken)

	app.Post("/register", userHandler.Register)
	users := app.Group("/users").Use(authMiddleware)
	users.Get("/:userId", userHandler.GetUser)

	app.Use(authMiddleware).Get("/dashboards", dashboardHandler.GetAllDashboardsForUser)
	app.Use(authMiddleware).Get("/dashboards/:dashboardId", dashboardHandler.GetDashboardForUser)

	dashboardGroup := app.Group("/dashboards/:dashboardId").Use(authMiddleware)
	dashboardGroup.Post("/categories", categoryHandler.CreateCategory)
	dashboardGroup.Post("/transactions", transactionHandler.CreateTransaction)
}

func rootController(c *fiber.Ctx) error {
	return c.SendString("Server is running")
}

func makeAuthMiddleware(authHandler *AuthHandler, userHandler *UserHandler) func(*fiber.Ctx) error {
	validateAuth := func(c *fiber.Ctx, key string) (bool, error) {
		userId, err := authHandler.service.Authenticate(key[7:]) // [7:] --> Remove "Bearer "

		if err != nil {
			return false, keyauth.ErrMissingOrMalformedAPIKey
		}

		user, err := userHandler.service.FindUserById(userId)
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
