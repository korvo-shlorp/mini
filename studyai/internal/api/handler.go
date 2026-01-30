package api

import (
    "encoding/json"
    "log"
    "net/http"
    "studyai/internal/agent"
    "studyai/internal/ai"
    "studyai/internal/models"
)

func setCORS(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func StudyHandler(w http.ResponseWriter, r *http.Request) {
    setCORS(w)
    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusNoContent)
        return
    }

    if r.Method != http.MethodPost {
        w.Header().Set("Allow", http.MethodPost)
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var req models.StudyRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
        return
    }

    resp, err := agent.Run(req)
    if err != nil {
        log.Printf("agent.Run error: %v", err)
        http.Error(w, "internal error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(resp); err != nil {
        log.Printf("encode response error: %v", err)
    }
}

// ChatHandler proxies simple chat messages to the LLM via internal/ai
func ChatHandler(w http.ResponseWriter, r *http.Request) {
    setCORS(w)
    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusNoContent)
        return
    }

    if r.Method != http.MethodPost {
        w.Header().Set("Allow", http.MethodPost)
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        return
    }

    var req struct {
        Message string `json:"message"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
        return
    }

    reply, err := ai.Chat(req.Message)
    if err != nil {
        log.Printf("ai.Chat error: %v", err)
        http.Error(w, "failed to get chat response", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"reply": reply})
}
