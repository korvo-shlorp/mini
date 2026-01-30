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
    } catch (err) {
      setError(err.message || 'Failed to evaluate study plan')
      console.error('Evaluation error:', err)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Study Plan Evaluator</h1>
        <p className="text-gray-400 mb-8">Get AI-powered feedback on your study plan</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Goal Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Study Goal *</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  placeholder="e.g., Pass final exam"
                  required
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-medium mb-2">Available Hours *</label>
                <input
                  type="number"
                  name="availableHours"
                  value={formData.availableHours}
                  onChange={handleInputChange}
                  placeholder="Total hours"
                  required
                  min="1"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Duration Days */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration (Days) *</label>
                <input
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  placeholder="Number of days"
                  required
                  min="1"
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Evaluating...' : 'Evaluate Study Plan'}
              </button>

              {error && (
                <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-slideUp">
              <h2 className="text-2xl font-bold mb-4">{result.decision}</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Score</p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                      {result.score}
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Risk Level</p>
                  <p className={`text-lg font-semibold ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </p>
                </div>

                {result.explanation && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Analysis</p>
                    <p className="text-gray-200 leading-relaxed text-sm">{result.explanation}</p>
                  </div>
                )}

                {result.sdgs && result.sdgs.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Sustainability Goals</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sdgs.map((sdg, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full"
                        >
                          {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.disclaimer && (
                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded p-3">
                    <p className="text-yellow-200 text-xs">{result.disclaimer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
