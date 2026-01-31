# StudyAI Architecture Diagrams

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDYAI v2.0                             │
│                  AI-Powered Learning Platform                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌────────┐
    │FRONTEND│        │BACKEND │        │ AI SVC │
    │(React) │        │ (Go)   │        │        │
    └────────┘        └────────┘        └────────┘
```

## Detailed Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      USER BROWSER / CLIENT                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              React Frontend (Vite)                       │    │
│  │                                                          │    │
│  │  ┌──────────┬──────────┬─────────┬──────────┐            │    │
│  │  │ Sidebar  │ChatUI    │Document │Learning  │            │    │
│  │  │Navigatio │Interface │Analyzer │Hub       │            │    │
│  │  │    (6    │          │         │          │            │    │
│  │  │  items)  │          │         │          │            │    │
│  │  └──────────┴──────────┴─────────┴──────────┘            │    │
│  │  ┌──────────┬──────────┬─────────┐                       │    │
│  │  │ Quizzes  │Progress  │Header   │                       │    │
│  │  │Page      │Tracking  │Navbar   │                       │    │
│  │  └──────────┴──────────┴─────────┘                       │    │
│  │                                                          │    │
│  │  State: React Hooks (useState, useEffect)                │    │
│  │  Styling: Tailwind CSS (dark theme)                      │    │
│  └──────────────────────────────────────────────────────────┘    │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       │ HTTP/REST (Axios)
                       │ CORS Enabled
                       │
        ┌──────────────▼───────────────┐
        │  API Gateway (HTTP Server)   │
        │  Port: 8080                  │
        │  Routes: 7 endpoints         │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┼──────────────────────┐
        │              │                      │
        ▼              ▼                      ▼
    ┌────────┐    ┌──────────┐        ┌──────────────┐
    │HANDLER │    │HANDLER   │        │HANDLER       │
    │        │    │          │        │              │
    │ChatHndl│    │ImageHndl │        │ProgressHndl  │
    │StudyHd │    │QuizHndl  │        │              │
    │        │    │          │        │              │
    └────────┘    └──────────┘        └──────────────┘
        │              │                      │
        └──────────────┼──────────────────────┘
                       │
        ┌──────────────▼───────────────────────┐
        │         Business Logic Layer         │
        │                                      │
        │  ┌──────────┐  ┌──────────┐          │
        │  │  Agent   │  │    AI    │          │
        │  │ Orchestr │  │ Interface│          │
        │  │ ation    │  │          │          │
        │  └──────────┘  └──────────┘          │
        │  ┌──────────────────────┐            │
        │  │   Media Package      │            │
        │  │  ┌────┐┌────┐┌────┐  │            │
        │  │  │OCR ││Quiz││Prog│  │            │
        │  │  └────┘└────┘└────┘  │            │
        │  │  ┌──────────┐        │            │
        │  │  │ Analyzer │        │            │
        │  │  └──────────┘        │            │
        │  └──────────────────────┘            │
        └──────────────┬───────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
    ┌────────────┐          ┌──────────────────┐
    │   Data     │          │  External AI APIs│
    │  Storage   │          │                  │
    │            │          │  ┌────────────┐  │
    │ ┌────────┐ │          │  │ Groq API   │  │
    │ │Progress│ │          │  │ (Llama 3.1)│  │
    │ │(in-mem)│ │          │  └────────────┘  │
    │ └────────┘ │          │  ┌────────────┐  │
    │            │          │  │ Google     │  │
    │ Future:    │          │  │ Vision /   │  │
    │ PostgreSQL │          │  │ Gemini     │  │
    │ MongoDB    │          │  └────────────┘  │
    │ MongoDB    │          │                  │
    └────────────┘          └──────────────────┘
```

## Data Flow Diagrams

### Image Analysis Flow

```
User Uploads Document
        │
        ▼
┌─────────────────┐
│  Receive File   │
│  Validate Type  │
│  Check Size     │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Convert to Base64   │
│ Package with Profile│
│ (grade, age, weak)  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  ImageAnalysis API  │
│   /analyze-image    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ OCR Service (Media) │
│ Call Google Vision (Gemini)
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Extract Text from   │
│ Image/Document      │
└────────┬────────────┘
         │
         ▼
┌──────────────────────────┐
│ Content Analyzer (Media) │
│ AI-Powered Analysis:     │
│ - Extract Questions      │
│ - Generate Revisions     │
│ - Find Materials         │
│ - Create Study Plan      │
│ - Tips & Assessment      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────┐
│ Return Results   │
│ (JSON Response)  │
└────────┬─────────┘
         │
         ▼
Display Results to User
```

### Quiz Generation & Taking Flow

```
User Selects Topic
       │
       ▼
┌─────────────────────┐
│ Quiz Settings:      │
│ - Difficulty        │
│ - # Questions       │
│ - Time Limit        │
└────────┬────────────┘
         │
         ▼
┌─────────────────┐
│ Generate Quiz   │
│ /generate-quiz  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Quiz Generation Service  │
│ AI Creates Questions via │
│ Groq Llama 3.1 API       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Generate Quiz Response   │
│ - Quiz ID                │
│ - Questions (4-options)  │
│ - Explanations           │
│ - Time Limit (if set)    │
└────────┬─────────────────┘
         │
         ▼
Display Quiz to User
         │
         ▼
User Answers Questions
         │
         ▼
┌──────────────────┐
│ Submit Answers   │
│ /submit-quiz     │
└────────┬─────────┘
         │
         ▼
┌────────────────────────────┐
│ Quiz Evaluation Service    │
│ - Score Calculation        │
│ - Identify Weak Areas      │
│ - Generate AI Feedback     │
│ - Recommendations          │
└────────┬───────────────────┘
         │
         ▼
Display Results:
- Score %
- Feedback
- Weak Topics
- Review Resources
```

### Progress Tracking Flow

```
User Opens Progress Tracking
         │
         ▼
┌─────────────────┐
│ Enter/Get       │
│ Student ID      │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Fetch Profile        │
│ /progress?id=...     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│ Progress Storage Service │
│ (Retrieve from In-Memory)│
│ If not exists: new empty │
└────────┬─────────────────┘
         │
         ▼
Display Profile:
- Student Info
- Statistics
- Topics
- Weak Areas
         │
         ▼
User Can Edit Profile
         │
         ▼
┌──────────────────────┐
│ Update Profile       │
│ /update-progress     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│ Save to Storage Service  │
│ (Store in In-Memory Map) │
│ Thread-Safe Update       │
└────────┬─────────────────┘
         │
         ▼
Display Confirmation
Update Summary & Charts
```

## Component Hierarchy

```
App.jsx (Root)
├── Sidebar.jsx
│   └── Menu Items (6)
│       ├── Chat
│       ├── Study Evaluator
│       ├── Document Analyzer ✨ NEW
│       ├── Learning Hub ✨ NEW
│       ├── Quizzes ✨ NEW
│       └── Progress Tracking ✨ NEW
├── Header.jsx
└── Content Router
    ├── ChatInterface.jsx
    ├── StudyEvaluator.jsx
    ├── DocumentAnalyzer.jsx ✨ NEW
    │   ├── File Upload
    │   ├── Profile Input
    │   └── Results Display
    ├── LearningHub.jsx ✨ NEW
    │   ├── Topic Selection
    │   ├── Subtopic Selection
    │   └── Lesson List
    ├── QuizzesPage.jsx ✨ NEW
    │   ├── Topic Selection
    │   ├── Quiz Settings
    │   ├── Quiz Taking (Q1→Qn)
    │   └── Results
    └── ProgressTracking.jsx ✨ NEW
        ├── Student ID Entry
        ├── Profile Editor
        ├── Statistics Cards
        └── Charts
```

## Go Package Structure

```
studyai/
├── cmd/
│   └── server/
│       └── main.go (Routes Setup)
│
└── internal/
    ├── api/
    │   ├── handler.go (Original)
    │   └── media_handler.go
    │       ├── ImageAnalysisHandler
    │       ├── GenerateQuizHandler
    │       ├── SubmitQuizHandler
    │       ├── GetProgressHandler
    │       └── UpdateProgressHandler
    │
    ├── agent/
    │   └── agent.go
    │
    ├── ai/
    │   ├── ai.go
    │   ├── chat.go
    │   └── client.go
    │
    ├── media/
    │   ├── ocr.go
        │   │   └── OCRService (Google Vision / Gemini)
    │   ├── analyzer.go
    │   │   └── AnalyzeEducationalContent()
    │   ├── quiz.go
    │   │   ├── GenerateQuiz()
    │   │   └── EvaluateQuiz()
    │   └── progress.go
    │       ├── GetStudentProgress()
    │       ├── UpdateStudentProgress()
    │       ├── RecordQuizAttempt()
    │       ├── UpdateStudyHours()
    │       └── AddTopic()
    │
    ├── models/
    │   └── models.go (10 new structs)
    │
    ├── guardrails/
    ├── rules/
    ├── scoring/
    └── validation/
```

## Request/Response Cycle

```
Browser Client Request
        │
        ▼
Vite Dev Server Proxy
        │
        ▼
Go Backend (localhost:8080)
        │
        ├── CORS Check ✓
        │
        ├── Route Handler
        │
        ├── Input Validation
        │
        ├── Business Logic
        │
        ├── AI Service Call (if needed)
        │
        ├── Response Building
        │
        └── JSON Encoding
        │
        ▼
HTTP Response (200/400/500)
        │
        ▼
Browser Receives JSON
        │
        ▼
React Updates State
        │
        ▼
Component Re-renders
        │
        ▼
User Sees Updated UI
```

## Database Schema (Future PostgreSQL)

```
STUDENTS
├── student_id (PK)
├── age
├── grade
├── created_at
└── updated_at

PROFILES
├── profile_id (PK)
├── student_id (FK)
├── topics_studying (JSON)
├── weak_areas (JSON)
└── updated_at

QUIZ_ATTEMPTS
├── attempt_id (PK)
├── student_id (FK)
├── quiz_id
├── topic
├── difficulty
├── score
├── time_spent
└── created_at

PROGRESS_STATS
├── stat_id (PK)
├── student_id (FK)
├── quizzes_attempted
├── average_score
├── total_study_hours
└── updated_at
```
---

These diagrams provide a comprehensive visual understanding of:
1. System architecture and components
2. Data flow through the application
3. Component hierarchy
4. Package structure
5. Request/response cycle
