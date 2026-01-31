# StudyAI v2.0 🎓

## Your Personal AI Study Assistant

StudyAI is an intelligent learning platform that uses AI agents to help students improve their learning efficiency, identify knowledge gaps, and track academic progress.

**[🎯 Quick Start](QUICKSTART.md)** | **[📚 Implementation Guide](IMPLEMENTATION_GUIDE.md)** | **[📋 Summary](SUMMARY.md)**

---

## ✨ Features

### 📄 Document Analyzer
Upload study materials (images, PDFs) and get:
- 🔍 Extracted questions automatically identified
- ❓ Personalized revision questions
- 📚 Recommended learning resources
- 📅 Custom study plans
- 💡 Evidence-based improvement tips

### ✅ AI-Powered Quizzes
Test your knowledge with:
- 🎯 AI-generated questions (any topic)
- 📊 Customizable difficulty levels
- ⏱️ Optional timed quizzes
- 📈 Performance analytics
- 🎯 Weakness identification

### 🎓 Learning Hub
Structured learning across:
- 📐 Mathematics (Algebra, Geometry, Calculus)
- 🔬 Science (Biology, Chemistry, Physics)
- 📚 History & Languages
- 12+ detailed subtopics
- Progressive difficulty levels

### 📊 Progress Tracking
Monitor your learning journey:
- 👤 Student profile management
- 📈 Quiz statistics
- ⏱️ Study hour tracking
- 🔥 Study streaks
- 📉 Weakness analysis

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Go 1.18+
- API Keys: `GROQ_API_KEY`, `GEMINI_API_KEY`

### Setup

**Backend**:
```bash
cd studyai
export GROQ_API_KEY=your_key
export GEMINI_API_KEY=your_key
go run cmd/server/main.go
# Server runs on http://localhost:8080
```

**Frontend**:
```bash
cd backend
npm install
npm run dev
# UI runs on http://localhost:5173
```

### Production Build
```bash
# Frontend
cd backend && npm run build

# Backend
cd studyai && go build -o study-agent cmd/server/main.go
```

---

## 🏗️ Architecture

### Frontend Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **API Client**: Axios

### Backend Stack
- **Language**: Go 1.18+
- **Framework**: Standard Library (net/http)
- **AI Integration**: Groq API (Llama 3.1), Google Gemini (Vision)

### AI Models
- **Content Analysis**: Groq Llama 3.1 8B (fast, efficient)
- **Image Processing**: Google Gemini (Vision)
- **Reasoning**: Both models handle complex educational content

---

## 📡 API Endpoints

### Original Endpoints (v1)
- `POST /api/agent/run` - Evaluate study plan
- `POST /api/chat` - Chat with AI

### New Endpoints (v2)
- `POST /api/analyze-image` - Analyze documents
- `POST /api/generate-quiz` - Generate quiz
- `POST /api/submit-quiz` - Submit quiz answers
- `GET /api/progress?student_id=...` - Get student profile
- `POST /api/update-progress` - Update profile

---

## 📁 Project Structure

```
mini/
├── backend/                 # Frontend (React/Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── StudyEvaluator.jsx
│   │   │   ├── DocumentAnalyzer.jsx      ✨ NEW
│   │   │   ├── LearningHub.jsx           ✨ NEW
│   │   │   ├── QuizzesPage.jsx           ✨ NEW
│   │   │   ├── ProgressTracking.jsx      ✨ NEW
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── studyai/                 # Backend (Go)
│   ├── cmd/
│   │   └── server/main.go
│   ├── internal/
│   │   ├── agent/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── models/
│   │   └── media/           ✨ NEW PACKAGE
│   │       ├── ocr.go
│   │       ├── analyzer.go
│   │       ├── quiz.go
│   │       └── progress.go
│   └── go.mod
│
├── IMPLEMENTATION_GUIDE.md  # Technical documentation
├── QUICKSTART.md           # User guide
├── SUMMARY.md              # Feature summary
├── JUDGES_CHECKLIST.md     # Hackathon evaluation guide
└── README.md               # This file
```

---

## 🎯 Use Cases

### For Students
- **Before Exam**: Upload past papers → Get practice questions & study plan
- **During Learning**: Take quizzes → Identify weak topics → Focus study
- **Track Progress**: Monitor improvement → Maintain motivation → Celebrate wins

### For Teachers
- Identify student knowledge gaps
- Recommend personalized study materials
- Monitor class progress trends

### For Parents
- Track child's academic progress
- See focus areas and improvements
- Encourage consistent studying

---

## 🔐 Safety & Ethics

### AI Safety
- ✅ **No guarantees**: All outputs include disclaimers
- ✅ **Transparent**: Explanations provided with recommendations
- ✅ **Graceful failures**: System never crashes, always has fallback
- ✅ **Educational focus**: Refuses non-educational content

### Data Privacy
- ✅ No sensitive data stored
- ✅ Progress stored per-student only
- ✅ API keys never logged
- ✅ CORS properly configured

### Limitations
- ⚠️ OCR may struggle with poor image quality
- ⚠️ Quiz quality depends on AI model capabilities
- ⚠️ Recommendations are advisory only
- ⚠️ Not a substitute for professional educators

---

## 🌍 SDG 4 Alignment

**Goal**: Quality Education for All

**How StudyAI Contributes**:

| Target | Implementation |
|--------|-----------------|
| 4.1: Quality Learning | AI analyzes student work, identifies gaps |
| 4.3: Lifelong Learning | Progress tracking maintains engagement |
| 4.5: Equitable Access | Free platform, works on any device |
| 4.a: Safe Learning | Online, 24/7 accessible, safe environment |

**Impact Metrics**:
- Students can see personalized learning paths
- Knowledge gaps are quickly identified
- Progress is measurable and visible
- Study efficiency improves with AI guidance

---

## 📊 Key Statistics

### Code
- **Go Backend**: ~600 lines (new code)
- **React Frontend**: ~1000 lines (new components)
- **Total**: ~1600 lines of new code
- **Components**: 4 new React components
- **API Endpoints**: 5 new endpoints
- **Documentation**: 1200+ lines

### Features
- **Topics**: 4 categories, 12+ subtopics
- **Quiz Questions**: Unlimited AI-generated
- **Supported Files**: JPG, PNG, PDF
- **Quiz Duration**: 5-120 questions
- **Time Limits**: Customizable (0-120 minutes)

---

## 🔄 Technology Decisions

### Why Go for Backend?
- Fast and efficient
- Simple deployment
- Excellent standard library
- Great for building APIs

### Why Groq + Gemini for AI?
- **Groq**: Ultra-fast text generation, cost-effective
- **Google Gemini**: Excellent vision/OCR capabilities
- **Combined**: Best tool for each task

### Why React for Frontend?
- Component reusability
- Large ecosystem
- Great for interactive UIs
- Vite for fast development

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Upload image and verify analysis
- [ ] Generate quiz and take it
- [ ] Submit quiz and view results
- [ ] Create student profile
- [ ] Track progress over time
- [ ] Test mobile responsiveness
- [ ] Verify error messages

### Automated Testing
Unit tests can be added for:
- `media/ocr_test.go` - Image processing
- `media/quiz_test.go` - Quiz generation
- `media/progress_test.go` - Profile management

---

## 📝 Configuration

### Environment Variables
```bash
# Required
GROQ_API_KEY=sk-...            # LLM (https://console.groq.com)
GEMINI_API_KEY=sk-...          # Vision API key (Google Cloud / Gemini)
```

### Frontend Config (vite.config.js)
- Proxy to backend: `http://localhost:8080`
- Port: `5173`

### Backend Config (main.go)
- Port: `:8080`
- CORS: All origins (can be restricted)

---

## 🚀 Deployment

### Local Development
```bash
# Terminal 1: Backend
cd studyai && go run cmd/server/main.go

# Terminal 2: Frontend
cd backend && npm run dev
```

### Production
```bash
# Docker recommended
docker build -t studyai .
docker run -e GROQ_API_KEY=... -e GEMINI_API_KEY=... -p 8080:8080 studyai
```

### Cloud Platforms
- **Frontend**: Vercel, Netlify, CloudFlare Pages
- **Backend**: AWS Lambda, Google Cloud Run, Heroku

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | Getting started guide for users |
| **IMPLEMENTATION_GUIDE.md** | Technical details for developers |
| **SUMMARY.md** | Feature and architecture overview |
| **JUDGES_CHECKLIST.md** | Hackathon evaluation guide |
| **README.md** | This file, project overview |

---

## 🔮 Future Enhancements

### Short Term (1-3 months)
- [ ] Database integration (PostgreSQL)
- [ ] User authentication
- [ ] Unit test coverage
- [ ] Performance monitoring

### Medium Term (3-6 months)
- [ ] Video lesson integration
- [ ] Spaced repetition algorithm
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### Long Term (6+ months)
- [ ] Peer learning features
- [ ] Parent/teacher dashboards
- [ ] Advanced analytics
- [ ] Gamification (badges, leaderboards)

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional topics and lessons
- More sophisticated quiz algorithms
- Enhanced visualization
- Performance optimizations
- Additional AI providers

---

## 📄 License

[Your License Here]

---

## 📧 Support

- **Documentation**: See QUICKSTART.md and IMPLEMENTATION_GUIDE.md
- **Issues**: Check the error message and console logs
- **Questions**: Review JUDGES_CHECKLIST.md for FAQs

---

## 🙏 Acknowledgments

### Built For
- Hackathon participants and judges
- Students seeking learning support
- Educators wanting personalized learning tools
- The open-source community

### Powered By
- [Groq](https://groq.com) - Fast LLM inference
- [Google](https://cloud.google.com/) - Gemini AI / Vision
- [React](https://react.dev) - Frontend framework
- [Go](https://golang.org) - Backend language

---

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Document Analysis | ✅ Complete | Uses Google Gemini (Vision) |
| Quiz Generation | ✅ Complete | AI-powered with Groq |
| Learning Hub | ✅ Complete | 12+ topics included |
| Progress Tracking | ✅ Complete | In-memory storage |
| Frontend UI | ✅ Complete | Mobile responsive |
| API Backend | ✅ Complete | 7 total endpoints |
| Documentation | ✅ Complete | 1200+ lines |
| Testing | 🔄 In Progress | Manual testing done |
| Deployment | 🔄 Ready | Needs production config |

**Overall Status**: ✅ **Production Ready for Hackathon Demo**

---

## 🎓 Learning Path

1. **Start Here**: [QUICKSTART.md](QUICKSTART.md)
2. **Explore Features**: Use each sidebar menu item
3. **Understand Architecture**: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
4. **For Judges**: [JUDGES_CHECKLIST.md](JUDGES_CHECKLIST.md)

---

**StudyAI v2.0** - Making Quality Education Accessible to All 🌍

*"An AI agent that helps students learn smarter, not harder."*

---

**Version**: 2.0  
**Last Updated**: January 30, 2026  
**Status**: ✅ Complete & Ready for Judging