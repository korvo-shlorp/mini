package models

type StudyRequest struct {
    Goal           string `json:"goal"`
    AvailableHours int    `json:"available_hours"`
    DurationDays   int    `json:"duration_days"`
    Difficulty     string `json:"difficulty"` // low, medium, high
}

type RuleResult struct {
    Feasible  bool
    RiskLevel string
    Issues    []string
}

type AgentResponse struct {
    Decision    string   `json:"decision"`
    Score       int      `json:"score"`
    RiskLevel   string   `json:"risk_level"`
    Explanation string   `json:"explanation"`
    SDGs        []string `json:"sdgs"`
    Disclaimer  string   `json:"disclaimer"`
}
