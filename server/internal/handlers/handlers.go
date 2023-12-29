package handlers

import (
	"JulienR1/moneymanager2/server/internal/middlewares"
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"JulienR1/moneymanager2/server/internal/repositories"
	"JulienR1/moneymanager2/server/internal/services"
	"JulienR1/moneymanager2/server/internal/validators"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
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
	dashboardService := services.MakeDashboardService(&dashboardRepository, &categoryService, &userService)
	transactionService := services.MakeTransactionService(&transactionRepository, &userService, &fileService, &categoryService)

	userHandler := MakeUserHandler(validator, &userService)
	categoryHandler := MakeCategoryHandler(validator, &categoryService, &dashboardService)
	authHandler := MakeAuthHandler(validator, &authService, &tokenService, &cookieService)
	dashboardHandler := MakeDashboardHandler(validator, &dashboardService, &userService)
	transactionHandler := MakeTransactionHandler(validator, &transactionService, &fileService, &categoryService, &dashboardService)

	authMiddleware := middlewares.MakeAuthMiddleware(&authService, &userService)
	dashboardMiddleware := middlewares.MakeDashboardMiddleware(&dashboardService)

	app.Static("/", "./public")

	api := app.Group("/api")
	api.Get("/", rootHandler)

	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Use(authMiddleware).Post("/refresh", authHandler.RefreshAccessToken)

	api.Post("/register", userHandler.Register)
	users := api.Group("/users").Use(authMiddleware)
	users.Get("/:userId", userHandler.GetUser)

	api.Use(authMiddleware).Get("/dashboards", dashboardHandler.GetAllDashboardsForUser)
	api.Use(authMiddleware).Get("/dashboards/:dashboardId", dashboardHandler.GetDashboardForUser)

	dashboardGroup := api.Group("/dashboards/:dashboardId").
		Use(authMiddleware).
		Use(dashboardMiddleware)
	dashboardGroup.Get("/users", dashboardHandler.GetUsers)
	dashboardGroup.Post("/categories", categoryHandler.CreateCategory)
	dashboardGroup.Get("/transactions", transactionHandler.GetTransactions)
	dashboardGroup.Post("/transactions", transactionHandler.CreateTransaction)
	dashboardGroup.Get("/transactions/:transactionId", transactionHandler.GetTransaction)

	app.Static("/*", "./public/index.html")
}

func rootHandler(c *fiber.Ctx) error {
	return c.SendString("Server is running")
}
