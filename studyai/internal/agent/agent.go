package agent

import (
    "strings"

    "studyai/internal/ai"
    "studyai/internal/guardrails"
    "studyai/internal/models"
    "studyai/internal/rules"
    "studyai/internal/scoring"
    "studyai/internal/validation"
)

func Run(req models.StudyRequest) (models.AgentResponse, error) {
    if err := validation.Validate(req); err != nil {
        return models.AgentResponse{
            Decision:   "Refused",
            Disclaimer: err.Error(),
        }, nil
    }

    req.Difficulty = normalizeDifficulty(req.Difficulty)

    if err := guardrails.Check(req); err != nil {
        return models.AgentResponse{
            Decision:   "Refused",
            Disclaimer: err.Error(),
        }, nil
    }

    ruleResult := rules.Apply(req)
    score := scoring.Calculate(req, ruleResult)
    explanation := ai.Explain(req, ruleResult, score)

    return models.AgentResponse{
        Decision:    "Study Plan Evaluation",
        Score:       score,
        RiskLevel:   ruleResult.RiskLevel,
        Explanation: explanation,
        SDGs:        []string{"SDG 4: Quality Education"},
        Disclaimer:  "This agent provides study guidance only and does not guarantee academic outcomes.",
    }, nil
}

func normalizeDifficulty(d string) string {
    d = strings.ToLower(strings.TrimSpace(d))
    switch d {
    case "easy", "e", "low":
        return "low"
    case "medium", "med", "m", "intermediate":
        return "medium"
    case "hard", "difficult", "high", "h":
        return "high"
    default:
        return d
    }
}
