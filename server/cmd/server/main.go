package main

import (
	"JulienR1/moneymanager2/server/internal/handlers"
	repoutils "JulienR1/moneymanager2/server/internal/pkg/repo-utils"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Could not load .env file")
	}

	db, err := sql.Open("postgres", os.Getenv("DATABASE_CONNECTION_STRING"))
	if err != nil {
		log.Fatal("Could not connect to the database: ", err.Error())
	}
	defer db.Close()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("ALLOWED_ORIGINS"),
		AllowCredentials: true,
	}))

	conn := repoutils.MakeDatabase(db)
	handlers.RegisterRoutes(app, &conn)
	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
