package src

import "net/http"

var Handlers = []HandlerRecord{{Path: "/", Handler: JsonHandler(rootHandler)}}

func rootHandler(r *http.Request) (interface{}, *HttpError) {
	return 42, nil
}
