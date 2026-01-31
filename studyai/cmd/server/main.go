package main

import (
    "log"
    "net/http"
    "studyai/internal/api"
)

func main() {
    // Original endpoints
    http.HandleFunc("/agent/run", api.StudyHandler)
    http.HandleFunc("/chat", api.ChatHandler)

    // New image analysis endpoints
    http.HandleFunc("/analyze-image", api.ImageAnalysisHandler)
    
    // Quiz endpoints
    http.HandleFunc("/generate-quiz", api.GenerateQuizHandler)
    http.HandleFunc("/submit-quiz", api.SubmitQuizHandler)
    
    // Progress tracking endpoints
    http.HandleFunc("/progress", api.GetProgressHandler)
    http.HandleFunc("/update-progress", api.UpdateProgressHandler)

    log.Println("Study Agent running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
