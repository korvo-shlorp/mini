# StudyAI API Reference v2.0

## Base URL
```
http://localhost:8080/api
```

## Headers Required (Most Endpoints)
```
Content-Type: application/json
```

---

## 📚 Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/chat` | Chat with AI | ✗ |
| POST | `/agent/run` | Evaluate study plan | ✗ |
| POST | `/analyze-image` | Analyze document | ✗ |
| POST | `/generate-quiz` | Generate quiz | ✗ |
| POST | `/submit-quiz` | Submit quiz | ✗ |
| GET | `/progress` | Get profile | ✗ |
| POST | `/update-progress` | Update profile | ✗ |

---

## 🔧 Detailed Endpoint Reference

### 1. Chat Endpoint

#### Request
```http
POST /api/chat
Content-Type: application/json

{
  "message": "What are effective study techniques?"
}
```

#### Response (200 OK)
```json
{
  "reply": "Effective study techniques include..."
}
```

#### Response (400 Bad Request)
```json
{
  "error": "invalid request body"
}
```

---

### 2. Study Plan Evaluation

#### Request
```http
POST /api/agent/run
Content-Type: application/json

{
  "goal": "Prepare for algebra exam",
  "available_hours": 20,
  "duration_days": 7,
  "difficulty": "medium"
}
```

#### Response (200 OK)
```json
{
  "decision": "Study Plan Evaluation",
  "score": 75,
  "risk_level": "low",
  "explanation": "This is a realistic study plan with...",
  "sdgs": ["SDG 4: Quality Education"],
  "disclaimer": "This agent provides study guidance only..."
}
```

#### Difficulty Levels
- `low` or `easy`
- `medium` or `intermediate`
- `high` or `hard`

---

### 3. Document Analysis (NEW)

#### Request
```http
POST /api/analyze-image
Content-Type: application/json

{
  "image_data": "base64_encoded_string",
  "image_type": "jpg",
  "student_grade": 9,
  "student_age": 14,
  "weak_areas": "Algebra, Chemistry"
}
```

#### Image Data Format
- Convert file to Base64
- Remove `data:image/jpg;base64,` prefix if present
- Include only the Base64 string

#### Supported Types
- `jpg`, `jpeg` → image/jpeg
- `png` → image/png
- `pdf` → application/pdf
- `gif` → image/gif

#### Response (200 OK)
```json
{
  "extracted_questions": [
    "What is the value of 2x + 5 = 15?",
    "Define photosynthesis"
  ],
  "revision_questions": [
    "Solve 3x - 7 = 20",
    "Explain the steps of photosynthesis"
  ],
  "learning_materials": [
    {
      "title": "Algebra Basics - Khan Academy",
      "description": "Complete algebra fundamentals course",
      "type": "video",
      "difficulty": "beginner"
    }
  ],
  "study_plan": {
    "timeline_weeks": 4,
    "daily_study_hours": 1.5,
    "topics": ["Linear Equations", "Systems of Equations"],
    "milestone_weeks": [
      "Week 1: Master linear equations",
      "Week 2-3: Practice problem solving",
      "Week 4: Full practice exams"
    ],
    "estimated_readiness": "Ready for assessment in 4-6 weeks"
  },
  "improvement_tips": [
    "Practice one problem type until confident",
    "Use visual aids for understanding",
    "Teach concepts to others"
  ],
  "difficulty_assessment": "This content is appropriate for Grade 9...",
  "disclaimer": "AI-generated recommendations are advisory only..."
}
```

#### Error Response (400)
```json
{
  "error": "invalid request body: missing student_grade"
}
```

#### Error Response (413)
```json
{
  "error": "File size must be less than 10MB"
}
```

---

### 4. Generate Quiz (NEW)

#### Request
```http
POST /api/generate-quiz
Content-Type: application/json

{
  "topic_name": "Photosynthesis",
  "difficulty": "medium",
  "num_questions": 10,
  "timed_minutes": 15
}
```

#### Parameters
- `topic_name` (string): Any valid topic
- `difficulty` (string): `easy`, `medium`, or `hard`
- `num_questions` (number): 5-20
- `timed_minutes` (number): 0 for untimed, 1-120 for timed

#### Response (200 OK)
```json
{
  "quiz_id": "quiz_1706562000",
  "questions": [
    {
      "id": "q_1",
      "question": "What is the primary purpose of photosynthesis?",
      "options": [
        "To produce energy for the plant",
        "To absorb water from soil",
        "To release oxygen",
        "To store excess nutrients"
      ],
      "correct_answer": 0,
      "explanation": "Photosynthesis converts light energy into chemical energy (ATP and glucose) that the plant uses..."
    },
    {
      "id": "q_2",
      "question": "Which organelle is responsible for photosynthesis?",
      "options": [
        "Mitochondria",
        "Chloroplast",
        "Nucleus",
        "Ribosome"
      ],
      "correct_answer": 1,
      "explanation": "Chloroplasts are the organelles where photosynthesis occurs. They contain chlorophyll..."
    }
  ],
  "time_limit": 900
}
```

#### Notes
- `correct_answer` is 0-indexed position in options
- `time_limit` in seconds (0 if untimed)
- Questions are always 4 multiple-choice options

---

### 5. Submit Quiz (NEW)

#### Request
```http
POST /api/submit-quiz
Content-Type: application/json

{
  "quiz_id": "quiz_1706562000",
  "answers": [0, 1, 2, 1, 0, 1, 2, 3, 0, 1],
  "time_spent": 480
}
```

#### Parameters
- `quiz_id` (string): From generate-quiz response
- `answers` (array): 0-indexed option selections
- `time_spent` (number): Seconds taken (0 for untimed)

#### Response (200 OK)
```json
{
  "score": 80,
  "percentage": 80.0,
  "correct_count": 8,
  "total_questions": 10,
  "feedback": "Good job! You have a solid understanding of photosynthesis...",
  "weak_topics": [
    "Photosynthetic pathways (C3, C4, CAM)",
    "Electron transport chain"
  ],
  "recommended_review": [
    "Review the dark reaction cycle",
    "Study photosystem I and II in detail",
    "Practice energy transfer calculations"
  ]
}
```

#### Scoring Notes
- Automatic answer comparison
- Feedback generated by AI
- Weak areas identified from wrong answers

---

### 6. Get Student Progress (NEW)

#### Request
```http
GET /api/progress?student_id=STU123456
```

#### Parameters
- `student_id` (required): Student identifier

#### Response (200 OK)
```json
{
  "student_id": "STU123456",
  "age": 14,
  "grade": 9,
  "topics_studying": ["Algebra", "Biology", "World History"],
  "weak_areas": ["Calculus", "Chemistry equations"],
  "quizzes_attempted": 12,
  "average_score": 78.5,
  "study_hours": 45.5,
  "last_updated": "2024-01-30T15:30:00Z"
}
```

#### Response (404 Not Found)
```json
{
  "student_id": "STU999999",
  "age": 0,
  "grade": 0,
  "topics_studying": [],
  "weak_areas": [],
  "quizzes_attempted": 0,
  "average_score": 0,
  "study_hours": 0,
  "last_updated": "2024-01-30T15:30:00Z"
}
```

#### Notes
- Returns empty profile if student doesn't exist
- Create profile by calling update-progress first

---

### 7. Update Student Progress (NEW)

#### Request
```http
POST /api/update-progress
Content-Type: application/json

{
  "student_id": "STU123456",
  "age": 14,
  "grade": 9,
  "topics_studying": ["Algebra", "Biology"],
  "weak_areas": ["Calculus", "Chemistry"]
}
```

#### Parameters
- `student_id` (string): Unique student identifier
- `age` (number): Student age
- `grade` (number): Grade level (6-12)
- `topics_studying` (array): Topics being studied
- `weak_areas` (array): Areas needing improvement

#### Response (200 OK)
```json
{
  "status": "success",
  "message": "Progress updated"
}
```

#### Response (400)
```json
{
  "error": "student_id is required"
}
```

#### Notes
- Creates profile if doesn't exist
- Updates all fields if profile exists
- Thread-safe in-memory storage

---

## 🔄 Common Workflows

### Workflow 1: Upload Document and Get Study Plan

```javascript
// 1. Read file as base64
const file = document.querySelector('input[type="file"]').files[0];
const reader = new FileReader();
reader.readAsDataURL(file);

reader.onload = async () => {
  const imageData = reader.result.split(',')[1];
  
  // 2. Send to analyze-image
  const response = await fetch('/api/analyze-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_data: imageData,
      image_type: file.type.split('/')[1],
      student_grade: 9,
      student_age: 14,
      weak_areas: 'Algebra'
    })
  });
  
  const analysis = await response.json();
  
  // 3. Display analysis results
  console.log('Study Plan:', analysis.study_plan);
  console.log('Revision Questions:', analysis.revision_questions);
};
```

### Workflow 2: Take and Submit Quiz

```javascript
// 1. Generate quiz
const quizResponse = await fetch('/api/generate-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic_name: 'Algebra',
    difficulty: 'medium',
    num_questions: 10,
    timed_minutes: 15
  })
});

const quiz = await quizResponse.json();
const answers = [0, 1, 2, 1, 0, 1, 2, 3, 0, 1]; // User answers

// 2. Submit quiz
const submitResponse = await fetch('/api/submit-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quiz_id: quiz.quiz_id,
    answers: answers,
    time_spent: 480
  })
});

const results = await submitResponse.json();
console.log('Score:', results.percentage + '%');
console.log('Feedback:', results.feedback);
```

### Workflow 3: Track Student Progress

```javascript
// 1. Get or create student profile
const getResponse = await fetch('/api/progress?student_id=STU123456');
const profile = await getResponse.json();

// 2. Update profile
const updateResponse = await fetch('/api/update-progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    student_id: 'STU123456',
    age: 14,
    grade: 9,
    topics_studying: ['Algebra', 'Biology'],
    weak_areas: ['Calculus']
  })
});

// 3. View progress
console.log('Quizzes Attempted:', profile.quizzes_attempted);
console.log('Average Score:', profile.average_score + '%');
```

---

## ⚠️ Error Handling

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request parameters |
| 405 | Method Not Allowed | Use correct HTTP method (GET/POST) |
| 413 | Payload Too Large | Reduce file size |
| 500 | Internal Error | Check API keys, retry request |

### Error Response Format
```json
{
  "error": "description of what went wrong"
}
```

---

## 🔐 Rate Limiting

Currently no rate limiting, but recommended for production:
- 100 requests/minute per IP
- 10 image uploads per hour per student
- 20 quiz generations per hour per student

---

## 🚀 Tips for Integration

### File Upload Best Practices
```javascript
// Check file size
if (file.size > 10 * 1024 * 1024) {
  throw new Error('File must be < 10MB');
}

// Convert to base64 efficiently
const base64 = await file.arrayBuffer()
  .then(buf => Buffer.from(buf).toString('base64'));
```

### Quiz Handling
```javascript
// Show timer
const timeLimit = quiz.time_limit;
setInterval(() => {
  if (timeRemaining <= 0) {
    submitQuiz(); // Auto-submit when time's up
  }
}, 1000);
```

### Progress Tracking
```javascript
// Cache profile locally
localStorage.setItem('studentID', studentID);
const cachedProfile = JSON.parse(
  localStorage.getItem('studentProfile')
);
```

---

## 📈 Performance Metrics

| Operation | Typical Time |
|-----------|-------------|
| Chat response | 1-3 seconds |
| Document analysis | 3-10 seconds |
| Quiz generation | 5-15 seconds |
| Quiz submission | 1-2 seconds |
| Profile update | <1 second |

---

## 🔗 Integration Examples

### cURL
```bash
# Generate quiz
curl -X POST http://localhost:8080/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "topic_name": "Algebra",
    "difficulty": "medium",
    "num_questions": 10,
    "timed_minutes": 15
  }'
```

### Python
```python
import requests

response = requests.post(
  'http://localhost:8080/api/generate-quiz',
  json={
    'topic_name': 'Algebra',
    'difficulty': 'medium',
    'num_questions': 10,
    'timed_minutes': 15
  }
)

quiz = response.json()
print(f"Quiz ID: {quiz['quiz_id']}")
```

### JavaScript/Node.js
```javascript
const response = await fetch(
  'http://localhost:8080/api/generate-quiz',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic_name: 'Algebra',
      difficulty: 'medium',
      num_questions: 10,
      timed_minutes: 15
    })
  }
);

const quiz = await response.json();
```

---

## 📞 Support

For API issues:
1. Check error message and code
2. Verify endpoint URL and method
3. Validate request parameters
4. Check API key configuration
5. Review logs for details

---

**API Version**: 2.0  
**Last Updated**: January 30, 2026  
**Status**: ✅ Production Ready
