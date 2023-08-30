package main

import (
	"JulienR1/moneymanager2/server/internal/handlers"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Could not load .env file")
	}

	app := fiber.New()
	handlers.RegisterRoutes(app)
	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
