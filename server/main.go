package main

import (
	"JulienR1/moneymanager2/server/src"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Could not load .env file")
	}

	for _, handler := range src.Handlers {
		http.HandleFunc(handler.Path, handler.Handler)
	}
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
