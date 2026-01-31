package media

import (
	"errors"
	"sync"
	"time"
	"studyai/internal/models"
)

// In-memory storage for student progress (replace with database in production)
var (
	progressStore = make(map[string]models.ProgressProfile)
	progressMutex sync.RWMutex
)

// GetStudentProgress retrieves a student's progress profile
func GetStudentProgress(studentID string) (models.ProgressProfile, error) {
	progressMutex.RLock()
	defer progressMutex.RUnlock()

	profile, exists := progressStore[studentID]
	if !exists {
		// Return empty profile if student doesn't exist yet
		return models.ProgressProfile{
			StudentID: studentID,
			Topics: []string{},
			WeakAreas: []string{},
			LastUpdated: time.Now().Format(time.RFC3339),
		}, nil
	}

	return profile, nil
}

// UpdateStudentProgress updates or creates a student's progress profile
func UpdateStudentProgress(profile models.ProgressProfile) error {
	if profile.StudentID == "" {
		return errors.New("student_id is required")
	}

	progressMutex.Lock()
	defer progressMutex.Unlock()

	profile.LastUpdated = time.Now().Format(time.RFC3339)
	progressStore[profile.StudentID] = profile

	return nil
}

// RecordQuizAttempt updates student progress after a quiz
func RecordQuizAttempt(studentID string, score float32, newWeakAreas []string) error {
	progressMutex.Lock()
	defer progressMutex.Unlock()

	profile, exists := progressStore[studentID]
	if !exists {
		profile = models.ProgressProfile{
			StudentID: studentID,
			Topics: []string{},
			WeakAreas: []string{},
		}
	}

	// Update quiz stats
	profile.QuizzesAttempted++
	
	if profile.AverageScore == 0 {
		profile.AverageScore = score
	} else {
		// Update running average
		profile.AverageScore = (profile.AverageScore + score) / 2
	}

	// Update weak areas
	for _, area := range newWeakAreas {
		found := false
		for _, existing := range profile.WeakAreas {
			if existing == area {
				found = true
				break
			}
		}
		if !found {
			profile.WeakAreas = append(profile.WeakAreas, area)
		}
	}

	profile.LastUpdated = time.Now().Format(time.RFC3339)
	progressStore[studentID] = profile

	return nil
}

// UpdateStudyHours increments the total study hours
func UpdateStudyHours(studentID string, hours float32) error {
	progressMutex.Lock()
	defer progressMutex.Unlock()

	profile, exists := progressStore[studentID]
	if !exists {
		profile = models.ProgressProfile{
			StudentID: studentID,
			Topics: []string{},
			WeakAreas: []string{},
		}
	}

	profile.StudyHours += hours
	profile.LastUpdated = time.Now().Format(time.RFC3339)
	progressStore[studentID] = profile

	return nil
}

// AddTopic adds a topic to a student's learning list
func AddTopic(studentID string, topic string) error {
	progressMutex.Lock()
	defer progressMutex.Unlock()

	profile, exists := progressStore[studentID]
	if !exists {
		profile = models.ProgressProfile{
			StudentID: studentID,
			Topics: []string{},
			WeakAreas: []string{},
		}
	}

	// Check if topic already exists
	for _, t := range profile.Topics {
		if t == topic {
			profile.LastUpdated = time.Now().Format(time.RFC3339)
			progressStore[studentID] = profile
			return nil
		}
	}

	profile.Topics = append(profile.Topics, topic)
	profile.LastUpdated = time.Now().Format(time.RFC3339)
	progressStore[studentID] = profile

	return nil
}
