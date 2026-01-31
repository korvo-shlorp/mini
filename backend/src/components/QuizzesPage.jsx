import { useState, useEffect, useCallback, useMemo } from 'react'
import { mediaAPI } from '../api'

export default function QuizzesPage() {
  const [view, setView] = useState('topics') // topics | quiz | results | review
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
  const [reviewIndex, setReviewIndex] = useState(0)

  const popularTopics = [
    'Mathematics - Algebra',
    'Mathematics - Geometry',
    'Science - Biology',
    'Science - Chemistry',
    'Science - Physics',
    'History',
    'English Literature',
  ]

  /* ---------------- Submit + Timer ---------------- */

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || loading) return

    setLoading(true)
    try {
      const result = await mediaAPI.submitQuiz(
        quiz.quiz_id,
        answers,
        timeLeft !== null ? quiz.time_limit - timeLeft : 0
      )
      setResults(result)
      setView('results')
    } catch (err) {
      alert('Failed to submit quiz: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [quiz, answers, timeLeft, loading])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, handleSubmitQuiz])

  /* ---------------- Helpers ---------------- */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const answeredCount = useMemo(
    () => answers.filter((a) => a !== null).length,
    [answers]
  )

  const incorrectQuestions = useMemo(() => {
    if (!quiz || !results?.answers) return []

    return quiz.questions
      .map((q, index) => ({
        question: q,
        correctIndex: results.answers[index]?.correct_index,
        userAnswer: answers[index],
      }))
      .filter(
        (q) =>
          q.userAnswer !== null &&
          q.userAnswer !== q.correctIndex
      )
  }, [quiz, results, answers])

  /* ---------------- Handlers ---------------- */

  const handleStartQuiz = async () => {
    if (!selectedTopic) return

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
      setResults(null)

      if (quizData.time_limit > 0) {
        setTimeLeft(quizData.time_limit)
      } else {
        setTimeLeft(null)
      }

      setView('quiz')
    } catch (err) {
      alert('Failed to generate quiz: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (idx) => {
    setAnswers((prev) => {
      const copy = [...prev]
      copy[currentQuestion] = idx
      return copy
    })
  }

  /* ---------------- TOPICS ---------------- */

  if (view === 'topics') {
    return (
      <div className="p-6 space-y-6">
        <h2 className="text-3xl font-bold">Quizzes</h2>

        <div className="grid grid-cols-2 gap-3">
          {popularTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`p-3 rounded-lg border text-left ${
                selectedTopic === topic
                  ? 'border-primary bg-primary/20'
                  : 'border-gray-600'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        <button
          onClick={handleStartQuiz}
          disabled={!selectedTopic || loading}
          className="w-full py-3 rounded-lg bg-primary text-white"
        >
          {loading ? 'Generating...' : 'Start Quiz'}
        </button>
      </div>
    )
  }

  /* ---------------- QUIZ ---------------- */

  if (view === 'quiz' && quiz) {
    const question = quiz.questions[currentQuestion]

    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-700 flex justify-between">
          <div>
            Question {currentQuestion + 1} / {quiz.questions.length}
            <p className="text-sm text-gray-400">
              {answeredCount} answered
            </p>
          </div>
          {timeLeft !== null && (
            <div
              className={`font-bold ${
                timeLeft < 60 ? 'text-red-500 animate-pulse' : ''
              }`}
            >
              ⏱ {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="flex-1 p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-4 rounded-lg border ${
                  answers[currentQuestion] === idx
                    ? 'border-primary bg-primary/30'
                    : 'border-gray-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={() =>
              setCurrentQuestion((q) => Math.max(q - 1, 0))
            }
            disabled={currentQuestion === 0}
          >
            ← Prev
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button onClick={handleSubmitQuiz}>
              Submit
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion((q) => q + 1)
              }
            >
              Next →
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ---------------- RESULTS ---------------- */

  if (view === 'results' && results) {
    return (
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Quiz Complete</h2>

        <div className="text-center text-5xl font-bold text-primary">
          {results.percentage.toFixed(0)}%
        </div>

        {incorrectQuestions.length > 0 && (
          <button
            onClick={() => {
              setReviewIndex(0)
              setView('review')
            }}
            className="w-full py-3 bg-gray-700 rounded-lg"
          >
            Review Incorrect Questions
          </button>
        )}

        <button
          onClick={() => setView('topics')}
          className="w-full py-3 bg-primary text-white rounded-lg"
        >
          Try Another Quiz
        </button>
      </div>
    )
  }

  /* ---------------- REVIEW ---------------- */

  if (view === 'review' && incorrectQuestions.length > 0) {
    const { question, correctIndex, userAnswer } =
      incorrectQuestions[reviewIndex]

    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-700">
          Review {reviewIndex + 1} / {incorrectQuestions.length}
        </div>

        <div className="flex-1 p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  idx === correctIndex
                    ? 'border-green-500 bg-green-500/20'
                    : idx === userAnswer
                    ? 'border-red-500 bg-red-500/20'
                    : 'border-gray-600'
                }`}
              >
                {idx === correctIndex && '✔ '}
                {idx === userAnswer && '✖ '}
                {opt}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between">
          <button
            onClick={() =>
              setReviewIndex((i) => Math.max(i - 1, 0))
            }
            disabled={reviewIndex === 0}
          >
            ← Prev
          </button>

          {reviewIndex === incorrectQuestions.length - 1 ? (
            <button onClick={() => setView('results')}>
              Back to Results
            </button>
          ) : (
            <button
              onClick={() =>
                setReviewIndex((i) => i + 1)
              }
            >
              Next →
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}
