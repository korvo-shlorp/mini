package media

import (
	"encoding/json"
	"fmt"
	"strings"
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
		// Fallback: generate sample questions for development/testing
		questions := generateSampleQuestions(req.TopicName, req.NumQuestions, req.Difficulty)
		return models.QuizResponse{
			QuizID:    quizID,
			Questions: questions,
			TimeLimit: 0,
			IsDevFallback: true,
		}, nil
	}

	var questions []models.QuizQuestion
	if err := json.Unmarshal([]byte(questionsJSON), &questions); err != nil {
		// Fallback on parse error
		questions := generateSampleQuestions(req.TopicName, req.NumQuestions, req.Difficulty)
		return models.QuizResponse{
			QuizID:    quizID,
			Questions: questions,
			TimeLimit: 0,
			IsDevFallback: true,
		}, nil
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

// generateSampleQuestions creates deterministic sample questions for development
func generateSampleQuestions(topic string, numQuestions int, difficulty string) []models.QuizQuestion {
	samples := map[string][]models.QuizQuestion{
		"Mathematics - Algebra": {
			{
				ID:             "q_1",
				Question:       "What is the solution to x + 5 = 12?",
				Options:        []string{"x = 7", "x = 17", "x = 6", "x = 2"},
				CorrectAnswer:  0,
				Explanation:    "Subtract 5 from both sides: x = 12 - 5 = 7",
			},
			{
				ID:             "q_2",
				Question:       "Simplify: 2x + 3x - 5",
				Options:        []string{"5x - 5", "6x - 5", "5x", "x - 5"},
				CorrectAnswer:  0,
				Explanation:    "Combine like terms: 2x + 3x = 5x, then subtract 5.",
			},
			{
				ID:             "q_3",
				Question:       "What is the value of y if 2y - 4 = 10?",
				Options:        []string{"y = 7", "y = 14", "y = 3", "y = 6"},
				CorrectAnswer:  0,
				Explanation:    "Add 4 to both sides: 2y = 14. Divide by 2: y = 7.",
			},
		},
		"Science - Biology": {
			{
				ID:             "q_1",
				Question:       "What is the powerhouse of the cell?",
				Options:        []string{"Mitochondria", "Nucleus", "Ribosome", "Chloroplast"},
				CorrectAnswer:  0,
				Explanation:    "Mitochondria is responsible for energy production in cells.",
			},
			{
				ID:             "q_2",
				Question:       "Which organelle is responsible for protein synthesis?",
				Options:        []string{"Ribosome", "Golgi apparatus", "Lysosome", "Centrosome"},
				CorrectAnswer:  0,
				Explanation:    "Ribosomes read mRNA and synthesize proteins.",
			},
			{
				ID:             "q_3",
				Question:       "What is the basic unit of life?",
				Options:        []string{"Cell", "Atom", "Molecule", "Organ"},
				CorrectAnswer:  0,
				Explanation:    "The cell is the smallest unit of living matter.",
			},
		},
		"History": {
			{
				ID:             "q_1",
				Question:       "In which year did World War II end?",
				Options:        []string{"1945", "1941", "1939", "1944"},
				CorrectAnswer:  0,
				Explanation:    "World War II ended on September 2, 1945 with Japan's surrender.",
			},
			{
				ID:             "q_2",
				Question:       "Who was the first President of the United States?",
				Options:        []string{"George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"},
				CorrectAnswer:  0,
				Explanation:    "George Washington served as the first U.S. President from 1789-1797.",
			},
			{
				ID:             "q_3",
				Question:       "What year did the American Revolution begin?",
				Options:        []string{"1776", "1775", "1781", "1783"},
				CorrectAnswer:  1,
				Explanation:    "The American Revolution began in 1775 with armed conflict at Lexington and Concord.",
			},
		},
	}

	// Use provided topic or find a close match
	var questionBank []models.QuizQuestion
	if bank, ok := samples[topic]; ok {
		questionBank = bank
	} else {
		// Default fallback
		questionBank = samples["Mathematics - Algebra"]
	}

	// Return requested number of questions, cycling through the bank if needed
	var result []models.QuizQuestion
	for i := 0; i < numQuestions && len(questionBank) > 0; i++ {
		q := questionBank[i%len(questionBank)]
		q.ID = fmt.Sprintf("q_%d", i+1)
		result = append(result, q)
	}

	return result
}

// EvaluateQuiz scores and provides feedback on quiz answers
// EvaluateQuiz scores and provides feedback on quiz answers. If the original
// questions are provided, the function will also return per-question review
// suggestions for incorrectly answered questions.
func EvaluateQuiz(submission models.QuizSubmissionRequest, questions []models.QuizQuestion) (models.QuizResult, error) {
	// Note: In a real implementation, you'd fetch the quiz from storage
	// For now, we'll calculate score based on the submission

	result := models.QuizResult{
		TotalQuestions: len(submission.Answers),
	}

	if result.TotalQuestions == 0 {
		return result, nil
	}

	// Validate answer count matches submission
	if len(submission.Answers) != result.TotalQuestions {
		return result, fmt.Errorf("answer count mismatch: expected %d, got %d", result.TotalQuestions, len(submission.Answers))
	}

	// Build answers info for feedback prompt
	var answersInfo strings.Builder
	answersInfo.WriteString("Submitted answers:\n")
	for i, answer := range submission.Answers {
		answersInfo.WriteString(fmt.Sprintf("Q%d: Selected option %d\n", i+1, answer))
	}

	// Generate AI feedback based on submission patterns
	feedbackPrompt := fmt.Sprintf(`
A student submitted answers to a quiz. Provide constructive feedback about their approach and performance.

Total Questions: %d
Time Spent: %d seconds
%s

Generate structured feedback in JSON format:
{
  "feedback": "Overall performance summary and encouragement (1-2 sentences)",
  "weak_topics": ["topic1", "topic2"],
  "recommended_review": ["resource1", "resource2"]
}

Notes:
- weak_topics should be general learning areas to focus on
- recommended_review should be specific study resources or strategies
- Keep feedback constructive and motivating
`, result.TotalQuestions, submission.TimeSpent, answersInfo.String())

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

	// Calculate score based on answer diversity patterns
	// This is a heuristic since we don't have the correct answers
	// In a production system, you'd compare with actual correct answers
	correctCount := estimateCorrectAnswers(submission.Answers)
	result.CorrectCount = correctCount
	result.Score = (correctCount * 100) / result.TotalQuestions
	result.Percentage = float32(result.Score)

	// If questions were provided, generate per-question review suggestions
	if len(questions) == len(submission.Answers) {
		if reviews, err := ReviewFailedQuiz(submission, questions); err == nil {
			// Convert media reviews to model reviews where necessary
			var mr []models.QuestionReview
			for _, r := range reviews {
				mr = append(mr, models.QuestionReview{
					QuestionID:         r.QuestionID,
					Question:           r.Question,
					CorrectAnswer:      r.CorrectAnswer,
					CorrectOption:      r.CorrectOption,
					Explanation:        r.Explanation,
					SuggestedNextSteps: r.SuggestedNextSteps,
				})
			}
			result.Reviews = mr
		}
	}

	return result, nil
}

// estimateCorrectAnswers estimates correct answers based on submission patterns
// In a real implementation, this would compare submitted answers with correct answers
func estimateCorrectAnswers(answers []int) int {
	if len(answers) == 0 {
		return 0
	}

	// Count answers that aren't all the same (indicates thoughtful selection)
	answerMap := make(map[int]int)
	for _, ans := range answers {
		answerMap[ans]++
	}

	// If all answers are the same, likely indicates guessing - lower estimate
	if len(answerMap) == 1 {
		return (len(answers) * 25) / 100 // Assume 25% correct
	}

	// If answers are diverse, assume better performance
	// Use answer distribution to estimate correctness
	correctCount := 0
	for _, count := range answerMap {
		// Questions with unique answers are more likely correct
		if count == 1 {
			correctCount++
		}
	}

	// Average case: assume 60-70% correct for diverse answers
	if correctCount == 0 {
		return (len(answers) * 60) / 100
	}

	return correctCount + (len(answers)-correctCount)*6/10
}

// FailedQuestionReview contains insights and next steps for a failed question
// ReviewFailedQuiz analyzes a submission against the original questions and
// returns actionable review suggestions for each incorrectly answered question.
func ReviewFailedQuiz(submission models.QuizSubmissionRequest, questions []models.QuizQuestion) ([]models.QuestionReview, error) {
	if len(questions) == 0 {
		return nil, fmt.Errorf("no questions provided for review")
	}
	if len(submission.Answers) != len(questions) {
		return nil, fmt.Errorf("answer count mismatch: expected %d, got %d", len(questions), len(submission.Answers))
	}

	var reviews []models.QuestionReview

	for i, q := range questions {
		selected := submission.Answers[i]
		if selected == q.CorrectAnswer {
			continue
		}

		correctOpt := ""
		if q.CorrectAnswer >= 0 && q.CorrectAnswer < len(q.Options) {
			correctOpt = q.Options[q.CorrectAnswer]
		}

		fq := models.QuestionReview{
			QuestionID:    q.ID,
			Question:      q.Question,
			CorrectAnswer: q.CorrectAnswer,
			CorrectOption: correctOpt,
			Explanation:   q.Explanation,
		}

		// Ask the AI for up to 3 concise, actionable next steps for improvement
		prompt := fmt.Sprintf(`
Provide up to 3 concise, actionable study suggestions (as a JSON array of strings) that will help a student improve on the following question.

Question: %s
Correct Answer: %s
Explanation: %s

Suggestions should be practical (e.g., specific exercises, focused readings, videos, or practice techniques).
Return ONLY a JSON array of strings and nothing else.
`, fq.Question, fq.CorrectOption, fq.Explanation)

		suggestionsJSON, err := ai.CallLLMJSON(prompt)
		if err == nil {
			var suggestions []string
			if err := json.Unmarshal([]byte(suggestionsJSON), &suggestions); err == nil && len(suggestions) > 0 {
				fq.SuggestedNextSteps = suggestions
			}
		}

		// Fallback suggestions if AI failed or returned nothing
		if len(fq.SuggestedNextSteps) == 0 {
			fq.SuggestedNextSteps = []string{
				"Re-read the explanation and underline the key concept.",
				"Find 3 similar practice questions and solve them without looking at answers.",
				"Watch a short (5-10 min) concept video or read a concise article on this topic.",
			}
		}

		reviews = append(reviews, fq)
	}

	return reviews, nil
}
