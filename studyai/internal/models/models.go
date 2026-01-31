package models

type StudyRequest struct {
    Goal           string `json:"goal"`
    AvailableHours int    `json:"available_hours"`
    DurationDays   int    `json:"duration_days"`
    Difficulty     string `json:"difficulty"` // low, medium, high
}

type ImageAnalysisRequest struct {
    ImageData    string `json:"image_data"`    // base64 encoded
    ImageType    string `json:"image_type"`    // jpg, png, pdf, etc.
    StudentGrade int    `json:"student_grade"` // optional: student's grade level
    StudentAge   int    `json:"student_age"`   // optional: student's age
    WeakAreas    string `json:"weak_areas"`    // optional: areas student struggles with
}

type ImageAnalysisResponse struct {
    ExtractedQuestions   []string                     `json:"extracted_questions"`
    RevisionQuestions    []string                     `json:"revision_questions"`
    LearningMaterials    []LearningMaterial           `json:"learning_materials"`
    StudyPlan            StudyPlanRecommendation      `json:"study_plan"`
    ImprovementTips      []string                     `json:"improvement_tips"`
    DifficultyAssessment string                       `json:"difficulty_assessment"`
    Disclaimer           string                       `json:"disclaimer"`
}

type LearningMaterial struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Type        string `json:"type"` // video, article, book, interactive
    URL         string `json:"url"`  // optional resource link
    Difficulty  string `json:"difficulty"` // beginner, intermediate, advanced
}

type StudyPlanRecommendation struct {
    TimelineWeeks    int      `json:"timeline_weeks"`
    DailyStudyHours  float32  `json:"daily_study_hours"`
    Topics           []string `json:"topics"`
    MilestoneWeeks   []string `json:"milestone_weeks"`
    EstimatedReadiness string `json:"estimated_readiness"` // e.g., "Ready for assessment in 4-6 weeks"
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

type QuizRequest struct {
    TopicName    string `json:"topic_name"`
    Difficulty   string `json:"difficulty"`   // easy, medium, hard
    NumQuestions int    `json:"num_questions"`
    TimedMinutes int    `json:"timed_minutes"` // 0 for untimed
}

type QuizQuestion struct {
    ID       string   `json:"id"`
    Question string   `json:"question"`
    Options  []string `json:"options"`
    CorrectAnswer int `json:"correct_answer"`
    Explanation string `json:"explanation"`
}

type QuizResponse struct {
    QuizID    string          `json:"quiz_id"`
    Questions []QuizQuestion  `json:"questions"`
    TimeLimit int             `json:"time_limit"` // in seconds
    IsDevFallback bool        `json:"is_dev_fallback"` // true if using sample questions
}

type QuizSubmissionRequest struct {
    QuizID      string `json:"quiz_id"`
    Answers     []int  `json:"answers"` // indices of selected answers
    TimeSpent   int    `json:"time_spent"` // in seconds
    Questions   []QuizQuestion `json:"questions"`
}

type QuizResult struct {
    Score              int      `json:"score"`
    Percentage         float32  `json:"percentage"`
    CorrectCount       int      `json:"correct_count"`
    TotalQuestions     int      `json:"total_questions"`
    Feedback           string   `json:"feedback"`
    WeakTopics         []string `json:"weak_topics"`
    RecommendedReview  []string `json:"recommended_review"`
    Reviews            []QuestionReview `json:"reviews"`
}

type QuestionReview struct {
    QuestionID         string   `json:"question_id"`
    Question           string   `json:"question"`
    CorrectAnswer      int      `json:"correct_answer"`
    CorrectOption      string   `json:"correct_option"`
    Explanation        string   `json:"explanation"`
    SuggestedNextSteps []string `json:"suggested_next_steps"`
}

type ProgressProfile struct {
    StudentID      string   `json:"student_id"`
    Age            int      `json:"age"`
    Grade          int      `json:"grade"`
    Topics         []string `json:"topics_studying"`
    WeakAreas      []string `json:"weak_areas"`
    QuizzesAttempted int    `json:"quizzes_attempted"`
    AverageScore   float32  `json:"average_score"`
    StudyHours     float32  `json:"study_hours"`
    LastUpdated    string   `json:"last_updated"`
}
