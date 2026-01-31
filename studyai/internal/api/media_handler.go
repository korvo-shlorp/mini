package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"studyai/internal/media"
	"studyai/internal/models"
)

// ImageAnalysisHandler handles image/PDF analysis requests
func ImageAnalysisHandler(w http.ResponseWriter, r *http.Request) {
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

	var req models.ImageAnalysisRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Extract text from image using OCR
	ocrService := media.NewOCRService()
	extractedText, err := ocrService.ExtractTextFromImage(req.ImageData)
	if err != nil {
		log.Printf("OCR error: %v", err)
		// Graceful fallback - return error but don't crash
		http.Error(w, "failed to process image: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Analyze the extracted content
	analysis, err := media.AnalyzeEducationalContent(extractedText, req)
	if err != nil {
		log.Printf("analysis error: %v", err)
		http.Error(w, "failed to analyze content", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(analysis); err != nil {
		log.Printf("encode response error: %v", err)
	}
}

// GenerateQuizHandler generates a quiz on a specific topic
func GenerateQuizHandler(w http.ResponseWriter, r *http.Request) {
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

	var req models.QuizRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate quiz request
	if req.NumQuestions < 1 || req.NumQuestions > 20 {
		http.Error(w, "num_questions must be between 1 and 20", http.StatusBadRequest)
		return
	}

	// Generate quiz questions using AI
	quizResp, err := media.GenerateQuiz(req)
	if err != nil {
		log.Printf("quiz generation error: %v", err)
		http.Error(w, "failed to generate quiz", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(quizResp); err != nil {
		log.Printf("encode response error: %v", err)
	}
}

// SubmitQuizHandler evaluates submitted quiz answers
func SubmitQuizHandler(w http.ResponseWriter, r *http.Request) {
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

	var req models.QuizSubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Evaluate quiz (in production, you'd need to store original quiz)
	result, err := media.EvaluateQuiz(req, req.Questions)
	if err != nil {
		log.Printf("quiz evaluation error: %v", err)
		http.Error(w, "failed to evaluate quiz", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(result); err != nil {
		log.Printf("encode response error: %v", err)
	}
}

// GetProgressHandler retrieves student progress profile
func GetProgressHandler(w http.ResponseWriter, r *http.Request) {
	setCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	studentID := r.URL.Query().Get("student_id")
	if studentID == "" {
		http.Error(w, "student_id parameter required", http.StatusBadRequest)
		return
	}

	// Retrieve progress (in production, this would query a database)
	profile, err := media.GetStudentProgress(studentID)
	if err != nil {
		log.Printf("progress retrieval error: %v", err)
		http.Error(w, fmt.Sprintf("student not found: %s", studentID), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(profile); err != nil {
		log.Printf("encode response error: %v", err)
	}
}

// UpdateProgressHandler updates student profile
func UpdateProgressHandler(w http.ResponseWriter, r *http.Request) {
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

	var profile models.ProgressProfile
	if err := json.NewDecoder(r.Body).Decode(&profile); err != nil {
		http.Error(w, "invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Update progress (in production, this would save to a database)
	err := media.UpdateStudentProgress(profile)
	if err != nil {
		log.Printf("progress update error: %v", err)
		http.Error(w, "failed to update progress", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Progress updated"})
}
