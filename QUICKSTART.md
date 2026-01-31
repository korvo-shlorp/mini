# StudyAI Features Quick Start

## What's New in v2.0

### 🎯 Main Features

#### 1. **📄 Document Analyzer**
Upload educational documents (images or PDFs) to:
- Extract all questions/problems
- Generate practice questions
- Get personalized study plans
- Find recommended learning materials
- Receive improvement tips

**How to Use**:
1. Click "Document Analyzer" in sidebar
2. Upload an image or PDF
3. Enter your grade, age, and weak areas
4. Click "Analyze Document"
5. Review all recommendations

---

#### 2. **🎓 Learning Hub**
Explore structured learning content:
- **4 Main Topics**: Math, Science, History, Languages
- **12+ Subtopics**: Detailed subject areas
- **Leveled Lessons**: Beginner → Intermediate → Advanced

**How to Use**:
1. Click "Learning Hub" in sidebar
2. Select a topic (e.g., "Mathematics")
3. Choose a subtopic (e.g., "Algebra")
4. Browse available lessons

---

#### 3. **✅ Quizzes**
Test your knowledge with AI-generated quizzes:
- Choose any topic
- Set difficulty level
- Select number of questions (5-20)
- Option: Add time limit
- Get instant feedback & scoring
- Identify weak areas

**How to Use**:
1. Click "Quizzes" in sidebar
2. Pick a topic
3. Customize settings (difficulty, questions, time)
4. Click "Start Quiz"
5. Answer all questions
6. Review results and recommendations

**Quiz Features**:
- ⏱️ Optional timer
- 📊 Progress bar
- 🔀 Question navigation
- 💾 Multiple choice with explanations
- 📈 Detailed feedback

---

#### 4. **📊 Progress Tracking**
Monitor your learning journey:
- Create student profile
- Track quiz scores
- View study statistics
- Monitor study streaks
- Identify improvement areas
- Edit profile anytime

**How to Use**:
1. Click "Progress Tracking" in sidebar
2. Enter your Student ID (e.g., STU123456)
3. Create/view profile
4. Edit profile to update info
5. View statistics and charts

**Tracked Metrics**:
- Quizzes completed
- Average score
- Total study hours
- Current study streak
- Weekly study time
- Topics being studied
- Areas needing improvement

---

## Sidebar Menu

```
💬 Chat              - Talk to AI study assistant
📚 Study Evaluator   - Evaluate study plans
📄 Document Analyzer - Upload & analyze documents
🎓 Learning Hub      - Structured learning content
✅ Quizzes          - AI-generated practice tests
📊 Progress Tracking - Monitor your progress
```

---

## Quick Tips

### For Image Analysis
- Works with JPG, PNG, PDF
- Max file size: 10MB
- Include your grade/age for better recommendations
- Mention weak areas for focused help

### For Quizzes
- Start with medium difficulty
- Try timed quizzes after untimed ones
- Review explanations even for correct answers
- Take multiple quizzes on same topic for mastery

### For Progress Tracking
- Save Student ID for future sessions
- Update profile when topics/goals change
- Check weekly chart to maintain study habits
- Use streak to stay motivated

---

## System Architecture

### Frontend (React/Vite)
```
App.jsx
├── Sidebar.jsx
├── ChatInterface.jsx
├── StudyEvaluator.jsx
├── DocumentAnalyzer.jsx
├── LearningHub.jsx
├── QuizzesPage.jsx
└── ProgressTracking.jsx
```

### Backend (Go)
```
cmd/server/main.go
internal/
├── api/
│   ├── handler.go
│   └── media_handler.go
├── agent/
├── ai/
├── media/
│   ├── ocr.go
│   ├── analyzer.go
│   ├── quiz.go
│   └── progress.go
└── models/
```

---

## Setting Up Locally

### Prerequisites
- Node.js 16+
- Go 1.18+
- Required API Keys

### Environment Variables
```bash
# Backend/.env or export
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_google_api_key
GEMINI_API_KEY=your_gemini_api_key (optional)
```

### Run Backend
```bash
cd studyai
go run cmd/server/main.go
# Server runs on http://localhost:8080
```

### Run Frontend
```bash
cd backend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Build for Production
**Frontend**:
```bash
cd backend
npm run build
# Output: dist/
```

**Backend**:
```bash
cd studyai
go build -o study-agent cmd/server/main.go
./study-agent
```

---

## API Endpoints Reference

### Chat
- `POST /api/chat` - Send message to AI

### Study Plans
- `POST /api/agent/run` - Evaluate study plan

### Document Analysis
- `POST /api/analyze-image` - Analyze uploaded document

### Quizzes
- `POST /api/generate-quiz` - Generate new quiz
- `POST /api/submit-quiz` - Submit and evaluate quiz

### Progress
- `GET /api/progress?student_id=STU123` - Get student profile
- `POST /api/update-progress` - Update student profile

---

## Troubleshooting

### Image Analysis Returns Error
**Problem**: "Failed to process image"
**Solution**: 
- Ensure image is < 10MB
- Try JPG or PNG format
- Check GEMINI_API_KEY is set

### Quiz Won't Generate
**Problem**: "Failed to generate quiz"
**Solution**:
- Verify topic name is valid
- Check GROQ_API_KEY is set
- Ensure num_questions is 5-20

### Progress Not Saving
**Problem**: "Failed to save profile"
**Solution**:
- Student ID must not be empty
- Age/Grade must be valid numbers
- Check browser console for details

### Timer Not Working
**Problem**: Quiz timer runs out but doesn't auto-submit
**Solution**:
- Refresh page and try again
- Manually click "Submit Quiz"
- Check browser console for errors

---

## Support

For issues or questions:
1. Check the error message in the UI
2. Look at browser console (F12 → Console)
3. Review backend logs
4. Verify all API keys are set correctly
5. Check internet connection

---

## Road Map

### Upcoming Features
- [ ] Video lesson integration
- [ ] Spaced repetition algorithm
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Peer study groups
- [ ] Parent reports
- [ ] Handwriting recognition
- [ ] Offline mode

---

**StudyAI v2.0** - Your Personal AI Study Assistant
*Making quality education accessible to everyone* 🌍

---

Last Updated: January 30, 2026
Status: Production Ready ✅
