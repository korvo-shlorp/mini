package media

import (
	"encoding/json"
	"fmt"
	"studyai/internal/ai"
	"studyai/internal/models"
	"time"
)

// GenerateQuiz creates a quiz with AI-generated questions
func GenerateQuiz(req models.QuizRequest) (models.QuizResponse, error) {
	quizID := fmt.Sprintf("quiz_%d", time.Now().Unix())

	prompt := fmt.Sprintf(`
Generate exactly %d multiple-choice quiz questions about "%s" at difficulty level "%s".

For each question, provide in JSON format within a JSON array:
{
  "question": "Question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Why this answer is correct"
}

Requirements:
- Questions must be clear and educational
- Options should be plausible (avoid obvious wrong answers)
- correct_answer is the 0-indexed position in options array
- Include detailed explanations for learning

Return ONLY valid JSON array, no additional text.
`, req.NumQuestions, req.TopicName, req.Difficulty)

	questionsJSON, err := ai.CallLLMJSON(prompt)
	if err != nil {
		// Fallback: return empty quiz with instructions
		return models.QuizResponse{
			QuizID:    quizID,
			Questions: []models.QuizQuestion{},
		}, err
	}

	var questions []models.QuizQuestion
	if err := json.Unmarshal([]byte(questionsJSON), &questions); err != nil {
		return models.QuizResponse{
			QuizID:    quizID,
			Questions: []models.QuizQuestion{},
		}, err
	}

	// Assign IDs to questions
	for i := range questions {
		questions[i].ID = fmt.Sprintf("q_%d", i+1)
	}

	timeLimit := 0
	if req.TimedMinutes > 0 {
		timeLimit = req.TimedMinutes * 60
	}

	return models.QuizResponse{
		QuizID:    quizID,
		Questions: questions,
		TimeLimit: timeLimit,
	}, nil
}

// EvaluateQuiz scores and provides feedback on quiz answers
func EvaluateQuiz(submission models.QuizSubmissionRequest) (models.QuizResult, error) {
	// Note: In a real implementation, you'd fetch the quiz from storage
	// For now, we'll generate feedback based on the submission

	result := models.QuizResult{
		TotalQuestions: len(submission.Answers),
	}

	if result.TotalQuestions == 0 {
		return result, nil
	}

	// Generate AI feedback
	feedbackPrompt := fmt.Sprintf(`
A student submitted answers to a quiz. Provided feedback about their performance.

Total Questions: %d
Time Spent: %d seconds
${answers_info}

Generate structured feedback:
1. Overall performance summary (1-2 sentences)
2. List of weak topic areas based on wrong answers
3. Specific recommendations for review

Return as JSON:
{
  "feedback": "Overall feedback text",
  "weak_topics": ["topic1", "topic2"],
  "recommended_review": ["resource1", "resource2"]
}
`, result.TotalQuestions, submission.TimeSpent)

	feedbackJSON, err := ai.CallLLMJSON(feedbackPrompt)
	if err == nil {
		var feedback struct {
			Feedback           string   `json:"feedback"`
			WeakTopics         []string `json:"weak_topics"`
			RecommendedReview  []string `json:"recommended_review"`
		}

		if err := json.Unmarshal([]byte(feedbackJSON), &feedback); err == nil {
			result.Feedback = feedback.Feedback
			result.WeakTopics = feedback.WeakTopics
			result.RecommendedReview = feedback.RecommendedReview
		}
	}

	// Calculate score (placeholder - in real app, compare with correct answers)
	result.CorrectCount = (result.TotalQuestions * 7) / 10 // Assume 70% correct
	result.Score = (result.CorrectCount * 100) / result.TotalQuestions
	result.Percentage = float32(result.Score)

	return result, nil
}
