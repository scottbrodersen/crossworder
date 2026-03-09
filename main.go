package main

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/scottbrodersen/crossworder/handler"
)

func main() {

	var currentLogLevel = slog.SetLogLoggerLevel(slog.LevelInfo)
	defer slog.SetLogLoggerLevel(currentLogLevel)

	// set up the server
	port := 3000
	var publicMux *http.ServeMux
	publicMux = http.NewServeMux()
	publicMux.Handle("/crossworder/", http.StripPrefix("/crossworder", handler.CrossworderFileServer(handler.CrossworderEFS)))

	// StartUnsafe for dev purposes only!
	StartUnsafe(DefaultShutdown, port, publicMux)
	//StartSafe(DefaultShutdown, port)

}

func StandardHeaders(header *http.Header) {
	//TODO: add csp
	header.Add("content-type", "application/json")
	//header.Add("Access-Control-Allow-Origin", allowedCorsOrigin)
	//header.Add("Cross-Origin-Resource-Policy", "same-origin")
	header.Add("Access-Control-Allow-Methods", allowedCorsMethods)
	header.Add("Access-Control-Allow-Headers", allowedCorsHeaders)
	header.Add("Access-Control-Allow-Credentials", "true")
}

const (
	//allowedCorsOrigin                 = "http://127.0.0.1:3000"
	allowedCorsMethods = "*"
	allowedCorsHeaders = "Set-Cookie"
)

func StartUnsafe(shutdown shutdownAction, port int, mux *http.ServeMux) {
	shutdown(http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), handler.NewRequestLogger(mux)))
}

// func StartSafe(shutdown shutdownAction, port int, mux *http.ServeMux) {
// 	shutdown(http.ListenAndServeTLS("0.0.0.0:443", "../expenses.crt", "../expenses.key", NewRequestLogger(mux)))
// 	isSafe = true
// }

type shutdownAction func(err error)

var DefaultShutdown shutdownAction = func(err error) {
	log.Fatal(err)
}
