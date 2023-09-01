package main

import (
	"JulienR1/moneymanager2/server/internal/handlers"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Could not load .env file")
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("ALLOWED_ORIGINS"),
		AllowCredentials: true,
	}))
	handlers.RegisterRoutes(app)
	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
