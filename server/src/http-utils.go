package src

import (
	"encoding/json"
	"net/http"
)

type Handler func(w http.ResponseWriter, r *http.Request)

type HandlerRecord struct {
	Path    string
	Handler Handler
}

type HttpError struct {
	code    int
	message string
}

type HandlerFunc func(*http.Request) (interface{}, *HttpError)

func JsonHandler(handler HandlerFunc) Handler {
	return func(w http.ResponseWriter, request *http.Request) {
		payload, err := handler(request)
		if err != nil {
			http.Error(w, err.message, err.code)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(payload)
	}
}
