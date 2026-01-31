package media

import (
	"encoding/json"
	"fmt"
	"studyai/internal/ai"
	"studyai/internal/models"
)

// AnalyzeEducationalContent analyzes extracted text from images/PDFs and generates educational outputs
func AnalyzeEducationalContent(extractedText string, req models.ImageAnalysisRequest) (models.ImageAnalysisResponse, error) {
	response := models.ImageAnalysisResponse{
		Disclaimer: "AI-generated recommendations are advisory only. Always verify content with certified educators.",
	}

	// Extract questions from the content
	questionsPrompt := fmt.Sprintf(`
From the following text extracted from an image or document, identify and list ALL questions or problems present:

TEXT:
%s

Return ONLY a JSON array of strings with the questions. Example format:
["What is photosynthesis?", "Define mitochondria", "Solve: 2x + 5 = 15"]
`, extractedText)

	questionsJSON, err := ai.CallLLMJSON(questionsPrompt)
	if err == nil {
		var questions []string
		if err := json.Unmarshal([]byte(questionsJSON), &questions); err == nil {
			response.ExtractedQuestions = questions
		}
	}

	// Generate revision questions
	revisionPrompt := fmt.Sprintf(`
Based on the following educational content, generate 5-8 revision questions that would help a student test their understanding:

CONTENT:
%s

STUDENT CONTEXT:
Grade: %d
Age: %d
Weak Areas: %s

Return ONLY a JSON array of strings with well-structured revision questions in increasing difficulty.
`, extractedText, req.StudentGrade, req.StudentAge, req.WeakAreas)

	revisionJSON, err := ai.CallLLMJSON(revisionPrompt)
	if err == nil {
		var revisions []string
		if err := json.Unmarshal([]byte(revisionJSON), &revisions); err == nil {
			response.RevisionQuestions = revisions
		}
	}

	// Recommend learning materials
	materialsPrompt := fmt.Sprintf(`
Based on the educational content below, recommend 4-6 supplementary learning resources (videos, articles, textbooks, interactive tools) that would help a student master this topic.

CONTENT:
%s

STUDENT: Grade %d, Age %d

For each resource, provide in JSON format:
[
  {
    "title": "Resource Name",
    "description": "Brief description",
    "type": "video|article|book|interactive",
    "difficulty": "beginner|intermediate|advanced"
  }
]
`, extractedText, req.StudentGrade, req.StudentAge)

	materialsJSON, err := ai.CallLLMJSON(materialsPrompt)
	if err == nil {
		var materials []models.LearningMaterial
		if err := json.Unmarshal([]byte(materialsJSON), &materials); err == nil {
			response.LearningMaterials = materials
		}
	}

	// Generate study plan
	planPrompt := fmt.Sprintf(`
Create a personalized study plan for a student to master the following topic:

TOPIC CONTENT:
%s

STUDENT: Grade %d, Age %d, Weak Areas: %s

Generate a study plan in JSON format:
{
  "timeline_weeks": <number>,
  "daily_study_hours": <float>,
  "topics": ["topic1", "topic2"],
  "milestone_weeks": ["week 1: learn basics", "week 2: practice problems"],
  "estimated_readiness": "Ready for assessment in X weeks"
}
`, extractedText, req.StudentGrade, req.StudentAge, req.WeakAreas)

	planJSON, err := ai.CallLLMJSON(planPrompt)
	if err == nil {
		var plan models.StudyPlanRecommendation
		if err := json.Unmarshal([]byte(planJSON), &plan); err == nil {
			response.StudyPlan = plan
		}
	}

	// Generate improvement tips
	tipsPrompt := fmt.Sprintf(`
Based on this educational content, provide 5-7 practical tips to help the student improve their understanding and retention:

CONTENT:
%s

STUDENT: Grade %d, Age %d, Struggling with: %s

Return as JSON array of strings with actionable tips.
`, extractedText, req.StudentGrade, req.StudentAge, req.WeakAreas)

	tipsJSON, err := ai.CallLLMJSON(tipsPrompt)
	if err == nil {
		var tips []string
		if err := json.Unmarshal([]byte(tipsJSON), &tips); err == nil {
			response.ImprovementTips = tips
		}
	}

	// Assess difficulty
	difficultyPrompt := fmt.Sprintf(`
Assess the difficulty level of the following content for a Grade %d student (Age %d):

CONTENT:
%s

WEAK AREAS: %s

Provide a brief assessment (1-2 sentences) indicating if this is appropriate for the student level and any prerequisite knowledge needed.
`, req.StudentGrade, req.StudentAge, extractedText, req.WeakAreas)

	difficulty, err := ai.CallLLM(difficultyPrompt)
	if err == nil {
		response.DifficultyAssessment = difficulty
	}

	return response, nil
}
