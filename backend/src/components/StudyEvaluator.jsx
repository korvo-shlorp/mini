import { useState } from 'react'
import { studyAPI } from '../api'

export default function StudyEvaluator() {
  const [formData, setFormData] = useState({
    goal: '',
    availableHours: '',
    durationDays: '',
    difficulty: 'medium',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'goal' || name === 'difficulty' ? value : parseInt(value) || '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await studyAPI.evaluateStudyPlan(
        formData.goal,
        formData.availableHours,
        formData.durationDays,
        formData.difficulty,
      )
      setResult(data)
      setShowModal(false)
    } catch (err) {
      setError(err.message || 'Failed to evaluate study plan')
      console.error('Evaluation error:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      goal: '',
      availableHours: '',
      durationDays: '',
      difficulty: 'medium',
    })
    setError('')
    setShowModal(false)
  }

  const closeResults = () => {
    setResult(null)
    setFormData({
      goal: '',
      availableHours: '',
      durationDays: '',
      difficulty: 'medium',
    })
  }

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'high':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  // Results View - Full Screen
  if (result) {
    return (
      <div className="flex-1 flex flex-col bg-dark">
        <div className="flex-shrink-0 p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span>📊</span> Study Plan Evaluation Results
            </h1>
          </div>
          <button
            onClick={closeResults}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-row gap-6 overflow-y-auto px-4 sm:px-6 py-6">

          <div className="w-full max-w-4xl mx-auto space-y-6">

            {/* Decision */}
            <div className="bg-gradient-to-r from-darkCard to-dark rounded-lg p-8 border border-gray-700">
              <h2 className="text-4xl font-bold flex items-center gap-3 text-white">
                <span className={result.decision?.toLowerCase().includes('succeed') || result.decision?.toLowerCase().includes('achievable') ? '✅' : result.decision?.toLowerCase().includes('adjust') ? '⚠️' : '❌'}></span>
                {result.decision || 'Study Plan Evaluation'}
              </h2>
            </div>

            {/* Score Section */}
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-8 border border-gray-700">
              <p className="text-gray-400 text-sm font-semibold mb-4">Success Score</p>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {result.score}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">out of 100</p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all duration-500 ${
                        result.score >= 75
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : result.score >= 50
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-3">
                    {result.score >= 75 ? '🎉 Highly Feasible' : result.score >= 50 ? '⚡ Moderately Feasible' : '🔴 Challenging'}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-8 border border-gray-700">
              <p className="text-gray-400 text-sm font-semibold mb-4">Risk Assessment</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl">
                  {result.risk_level?.toLowerCase() === 'low' ? '🟢' : result.risk_level?.toLowerCase() === 'medium' ? '🟡' : '🔴'}
                </span>
                <p className={`text-2xl font-bold ${getRiskColor(result.risk_level)}`}>
                  {result.risk_level || 'Unknown'}
                </p>
              </div>
            </div>
            </div>

            {/* Analysis */}
            {result.explanation && (
              <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-8 border border-gray-700">
                <p className="text-gray-400 text-sm font-semibold mb-4 flex items-center gap-2">
                  <span>💭</span> Detailed Analysis
                </p>
                <p className="text-gray-200 leading-relaxed text-base">{result.explanation}</p>
              </div>
            )}

            
          </div>
          <div className="flex-grow mx-6">
            {/* Sustainability Goals
            {result.sdgs && result.sdgs.length > 0 && (
              <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-8 border border-gray-700">
                <p className="text-gray-400 text-sm font-semibold mb-4 flex items-center gap-2">
                  <span>🎯</span> Sustainability Goals
                </p>
                <div className="flex flex-wrap gap-3">
                  {result.sdgs.map((sdg, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-900/40 text-blue-300 text-sm px-4 py-2 rounded-lg border border-blue-700/40 font-medium"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
            )} */}

            {/* Disclaimer */}
            {result.disclaimer && (
              <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-6">
                <p className="text-amber-100 text-sm flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 text-lg">📌</span>
                  <span className="leading-relaxed">{result.disclaimer}</span>
                </p>
              </div>
            )}
          </div>
        </div>
    )
  }

  // Main View - With Modal
  return (
    <div className="flex-1 flex flex-col bg-dark overflow-hidden">
      <div className="flex-shrink-0 p-6 border-b border-gray-700">
        <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
          <span>📊</span> Study Plan Evaluator
        </h1>
        <p className="text-gray-400 text-lg">Get AI-powered feedback on your study plan and assess your success probability</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-8xl mb-6">📈</div>
          <h2 className="text-3xl font-bold text-white mb-3">Create Your Study Plan</h2>
          <p className="text-gray-400 text-lg mb-8">Get AI-powered insights about your study schedule and success probability</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition text-lg"
          >
            Start Evaluation
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-darkCard to-dark rounded-lg border border-gray-700 w-full max-w-md max-h-screen overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-darkCard border-b border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-400">Study Plan Details</h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Goal Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Study Goal *</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="e.g., Pass final exam"
                  required
                  className="w-full bg-dark border border-gray-600 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Available Hours *</label>
                <input
                  type="number"
                  name="availableHours"
                  value={formData.availableHours}
                  onChange={handleInputChange}
                  placeholder="Total hours"
                  required
                  min="1"
                  className="w-full bg-dark border border-gray-600 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Duration Days */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Duration (Days) *</label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  placeholder="Number of days"
                  required
                  min="1"
                  className="w-full bg-dark border border-gray-600 text-white rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Difficulty Level *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full bg-dark border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
                  <span className="flex-shrink-0 text-lg">⚠️</span>
                  <div>{error}</div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.goal || !formData.availableHours || !formData.durationDays}
                className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${
                  loading || !formData.goal || !formData.availableHours || !formData.durationDays
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Evaluating Plan...
                  </span>
                ) : (
                  'Evaluate Study Plan'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
