package guardrails

import (
    "errors"
    "studyai/internal/models"
)

func Check(req models.StudyRequest) error {
    // Treat AvailableHours as total hours across the duration and validate per-day limits.
    if req.DurationDays <= 0 {
        return errors.New("duration days must be greater than zero")
    }
    hoursPerDay := float64(req.AvailableHours) / float64(req.DurationDays)
    if hoursPerDay > 16 {
        return errors.New("unrealistic daily study hours")
    }

    if req.Difficulty != "low" &&
        req.Difficulty != "medium" &&
        req.Difficulty != "high" {
        return errors.New("invalid difficulty level")
    }

    return nil
}
