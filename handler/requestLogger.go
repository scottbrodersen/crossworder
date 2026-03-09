package handler

import (
	"log/slog"
	"net/http"
)

// A RequestLogger is middleware for logging requests
type RequestLogger struct {
	handler http.Handler
	log     *slog.Logger
}

func NewRequestLogger(h http.Handler) *RequestLogger {
	logger := slog.Default()
	return &RequestLogger{handler: h, log: logger}
}

// ServeHTTP logs request details then passes the request to the handler
func (rl *RequestLogger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fields := map[string]interface{}{"requested": r.RequestURI, "cookies": r.Header.Values("Cookie"), "remote": r.RemoteAddr}
	rl.log.Info("Handling request", "fields", fields)

	rl.handler.ServeHTTP(w, r)
}
