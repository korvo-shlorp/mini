import { useState, useEffect } from 'react'
import { mediaAPI } from '../api'

export default function QuizzesPage() {
  const [view, setView] = useState('topics') // topics, quiz, results
  const [selectedTopic, setSelectedTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [numQuestions, setNumQuestions] = useState(10)
  const [timedMinutes, setTimedMinutes] = useState(0)
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [results, setResults] = useState(null)

  const populartTopics = [
    'Mathematics - Algebra',
    'Mathematics - Geometry',
    'Science - Biology',
    'Science - Chemistry',
    'Science - Physics',
    'History',
    'English Literature',
  ]

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartQuiz = async () => {
    if (!selectedTopic) {
      alert('Please select a topic')
      return
    }

    setLoading(true)
    try {
      const quizData = await mediaAPI.generateQuiz(
        selectedTopic,
        difficulty,
        numQuestions,
        timedMinutes
      )
      setQuiz(quizData)
      setAnswers(new Array(quizData.questions.length).fill(null))
      setCurrentQuestion(0)
      if (quizData.time_limit > 0) {
        setTimeLeft(quizData.time_limit)
      }
      setView('quiz')
    } catch (error) {
      alert('Failed to generate quiz: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    setLoading(true)
    try {
      const result = await mediaAPI.submitQuiz(
        quiz.quiz_id,
        answers,
        timeLeft !== null ? quiz.time_limit - timeLeft : 0
      )
      setResults(result)
      setView('results')
    } catch (error) {
      alert('Failed to submit quiz: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRetakeQuiz = () => {
    setView('topics')
    setSelectedTopic('')
    setQuiz(null)
    setResults(null)
    setCurrentQuestion(0)
    setAnswers([])
    setTimeLeft(null)
  }

  if (view === 'topics') {
    return (
      <div className="flex flex-col h-full overflow-y-auto p-6">
        <h2 className="text-3xl font-bold mb-2">Quizzes</h2>
        <p className="text-gray-400 mb-6">Test your knowledge with our interactive quizzes</p>

        <div className="space-y-6">
          {/* Topic Selection */}
          <div>
            <label className="block text-lg font-semibold mb-3">Select Topic</label>
            <div className="grid grid-cols-2 gap-3">
              {populartTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3 rounded-lg border transition text-left ${
                    selectedTopic === topic
                      ? 'border-primary bg-primary/20'
                      : 'border-gray-600 hover:border-primary'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Quiz Settings */}
          <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Quiz Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-400 mt-1">{numQuestions} questions</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={timedMinutes}
                  onChange={(e) => setTimedMinutes(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                  placeholder="0 for untimed"
                />
                <p className="text-xs text-gray-500 mt-1">0 = untimed quiz</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!selectedTopic || loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading || !selectedTopic
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {loading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>
      </div>
    )
  }

  if (view === 'quiz' && quiz) {
    const question = quiz.questions[currentQuestion]
    const isAnswered = answers[currentQuestion] !== null

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-darkCard border-b border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </h2>
              <p className="text-gray-400">
                Progress: {answers.filter((a) => a !== null).length} answered
              </p>
            </div>
            {timeLeft !== null && (
              <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-primary'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition ${
                    answers[currentQuestion] === idx
                      ? 'border-primary bg-primary/20'
                      : 'border-gray-600 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === idx
                          ? 'border-primary bg-primary'
                          : 'border-gray-600'
                      }`}
                    >
                      {answers[currentQuestion] === idx && (
                        <span className="text-white text-sm">✓</span>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-darkCard border-t border-gray-700 p-6">
          <div className="flex justify-between items-center max-w-2xl mx-auto w-full">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                currentQuestion === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              ← Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 rounded-lg font-medium bg-primary hover:bg-primary-dark text-white transition"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (view === 'results' && results) {
    return (
      <div className="flex flex-col h-full overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-400 mb-8">Here's how you performed:</p>

          {/* Score Card */}
          <div className="bg-darkCard rounded-lg p-8 border border-gray-700 text-center mb-8">
            <div className="text-6xl font-bold text-primary mb-2">
              {results.percentage.toFixed(0)}%
            </div>
            <p className="text-gray-300 text-lg">
              {results.correct_count} out of {results.total_questions} correct
            </p>
          </div>

          {/* Feedback */}
          {results.feedback && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-3">Feedback</h3>
              <p className="text-gray-300">{results.feedback}</p>
            </div>
          )}

          {/* Weak Topics */}
          {results.weak_topics && results.weak_topics.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-3">📌 Areas to Review</h3>
              <ul className="space-y-2">
                {results.weak_topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <span className="text-primary">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Review */}
          {results.recommended_review && results.recommended_review.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-3">💡 Recommended Review</h3>
              <ul className="space-y-2">
                {results.recommended_review.map((rec, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-300">
                    <span className="text-primary">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleRetakeQuiz}
            className="w-full py-3 rounded-lg font-semibold bg-primary hover:bg-primary-dark text-white transition"
          >
            Try Another Quiz
          </button>
        </div>
      </div>
    )
  }

  return null
}
