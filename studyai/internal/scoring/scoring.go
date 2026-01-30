package scoring

import "studyai/internal/models"

func Calculate(req models.StudyRequest, result models.RuleResult) int {
    score := 100

    if !result.Feasible {
        score -= 40
    }

    switch result.RiskLevel {
    case "Medium":
        score -= 20
    case "High":
        score -= 40
    }

    if req.Difficulty == "high" {
        score -= 10
    }

    if score < 0 {
        score = 0
    }

    return score
}
