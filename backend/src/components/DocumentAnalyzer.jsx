import { useState } from 'react'
import { mediaAPI } from '../api'

export default function DocumentAnalyzer() {
  const [file, setFile] = useState(null)
  const [studentGrade, setStudentGrade] = useState(9)
  const [studentAge, setStudentAge] = useState(14)
  const [weakAreas, setWeakAreas] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = reject
    })
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const base64Data = await convertFileToBase64(file)
      const imageType = file.type.split('/').pop()

      const analysis = await mediaAPI.analyzeImage(
        base64Data,
        imageType,
        studentGrade,
        studentAge,
        weakAreas
      )

      setResult(analysis)
    } catch (err) {
      setError(err.message || 'Failed to analyze document. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-dark">
      {/* Upload Section */}
      <div className="flex-shrink-0 bg-gradient-to-r from-darkCard to-dark border-b border-gray-700 p-6">
        <h2 className="text-3xl font-bold mb-2 text-white">📄 Document Analyzer</h2>
        <p className="text-gray-400 mb-6">Upload an image or PDF to analyze questions and get personalized study recommendations.</p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 text-gray-300">Upload Document (Image or PDF)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-gray-900/50 transition cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer block">
              {file ? (
                <div>
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-blue-400 font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-3">📤</div>
                  <p className="text-gray-300 font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, or PDF (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Student Profile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Grade Level</label>
            <select
              value={studentGrade}
              onChange={(e) => setStudentGrade(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Age</label>
            <input
              type="number"
              value={studentAge}
              onChange={(e) => setStudentAge(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition"
              min="5"
              max="25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Areas of Weakness</label>
            <input
              type="text"
              placeholder="e.g., Algebra, Science"
              value={weakAreas}
              onChange={(e) => setWeakAreas(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
            loading || !file
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Analyzing Document...
            </span>
          ) : (
            'Analyze Document'
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Extracted Questions */}
          {result.extracted_questions && result.extracted_questions.length > 0 && (
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
                <span>📋</span> Questions Found ({result.extracted_questions.length})
              </h3>
              <div className="space-y-3">
                {result.extracted_questions.map((q, idx) => (
                  <div key={idx} className="bg-dark/60 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold text-lg flex-shrink-0 w-8">{idx + 1}.</span>
                      <p className="text-gray-200 flex-1 leading-relaxed break-words">{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revision Questions */}
          {result.revision_questions && result.revision_questions.length > 0 && (
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <span>✅</span> Revision Questions ({result.revision_questions.length})
              </h3>
              <div className="space-y-3">
                {result.revision_questions.map((q, idx) => (
                  <div key={idx} className="bg-dark/60 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-green-400 font-bold text-lg flex-shrink-0 w-8">{idx + 1}.</span>
                      <p className="text-gray-200 flex-1 leading-relaxed break-words">{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Plan */}
          {result.study_plan && (
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                <span>📅</span> Recommended Study Plan
              </h3>
              <div className="space-y-3 text-gray-200">
                <div className="bg-dark/60 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm"><span className="font-semibold text-gray-300">Timeline:</span> <span className="text-blue-300">{result.study_plan.timeline_weeks} weeks</span></p>
                </div>
                <div className="bg-dark/60 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm"><span className="font-semibold text-gray-300">Daily Study Hours:</span> <span className="text-blue-300">{result.study_plan.daily_study_hours} hours</span></p>
                </div>
                {result.study_plan.estimated_readiness && (
                  <div className="bg-dark/60 rounded-lg p-4 border border-gray-700">
                    <p className="text-sm"><span className="font-semibold text-gray-300">Estimated Readiness:</span> <span className="text-blue-300">{result.study_plan.estimated_readiness}</span></p>
                  </div>
                )}
                {result.study_plan.topics && result.study_plan.topics.length > 0 && (
                  <div className="bg-dark/60 rounded-lg p-4 border border-gray-700">
                    <p className="font-semibold text-gray-300 mb-3">Topics to Cover:</p>
                    <ul className="space-y-2">
                      {result.study_plan.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-200">
                          <span className="text-purple-400 flex-shrink-0 mt-1">→</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Learning Materials */}
          {result.learning_materials && result.learning_materials.length > 0 && (
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <h3 className="text-xl font-bold mb-4 text-orange-400 flex items-center gap-2">
                <span>📚</span> Recommended Learning Materials ({result.learning_materials.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.learning_materials.map((material, idx) => (
                  <div key={idx} className="bg-dark/60 rounded-lg p-5 border border-gray-700 hover:border-gray-600 hover:shadow-lg transition">
                    <h4 className="font-semibold text-white mb-2 text-base">{material.title}</h4>
                    <p className="text-sm text-gray-400 mb-3 leading-relaxed">{material.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {material.type && (
                        <span className="inline-block bg-blue-900/40 text-blue-300 px-3 py-1 rounded-md text-xs font-medium border border-blue-700/40">
                          {material.type}
                        </span>
                      )}
                      {material.difficulty && (
                        <span className="inline-block bg-amber-900/40 text-amber-300 px-3 py-1 rounded-md text-xs font-medium border border-amber-700/40">
                          {material.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          {result.improvement_tips && result.improvement_tips.length > 0 && (
            <div className="bg-gradient-to-br from-darkCard to-dark rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
              <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <span>💡</span> Improvement Tips
              </h3>
              <div className="space-y-3">
                {result.improvement_tips.map((tip, idx) => (
                  <div key={idx} className="bg-dark/60 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 flex-shrink-0 font-bold">✦</span>
                      <p className="text-gray-200 flex-1 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          {result.disclaimer && (
            <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-5 text-amber-100">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <span>📌</span> Disclaimer
              </p>
              <p className="text-sm leading-relaxed text-amber-50">{result.disclaimer}</p>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-400 text-lg">Upload a document to get started</p>
            <p className="text-gray-500 text-sm mt-2">Analyze questions and get personalized study recommendations</p>
          </div>
        </div>
      )}
    </div>
  )
}
