package rules

import "studyai/internal/models"

func Apply(req models.StudyRequest) models.RuleResult {
    issues := []string{}
    hoursPerDay := float64(req.AvailableHours) / float64(req.DurationDays)

    if req.Difficulty == "high" && hoursPerDay < 2.0 {
        issues = append(issues, "insufficient daily study time for high difficulty material")
    }

    if hoursPerDay > 8.0 {
        issues = append(issues, "risk of burnout due to excessive daily hours")
    }

    feasible := len(issues) == 0
    risk := "Low"
    if len(issues) == 1 {
        risk = "Medium"
    } else if len(issues) > 1 {
        risk = "High"
    }

    return models.RuleResult{
        Feasible:  feasible,
        RiskLevel: risk,
        Issues:    issues,
    }
}
