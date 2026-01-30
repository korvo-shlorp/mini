package main

import (
    "log"
    "net/http"
    "studyai/internal/api"
)

func main() {
    http.HandleFunc("/agent/run", api.StudyHandler)
    http.HandleFunc("/chat", api.ChatHandler)

    log.Println("Study Agent running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
