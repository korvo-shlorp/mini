package validation

import (
    "errors"
    "studyai/internal/models"
)

func Validate(req models.StudyRequest) error {
    if req.Goal == "" {
        return errors.New("study goal is required")
    }
    if req.AvailableHours <= 0 {
        return errors.New("available hours must be greater than zero")
    }
    if req.DurationDays <= 0 {
        return errors.New("duration days must be greater than zero")
    }
    return nil
}
