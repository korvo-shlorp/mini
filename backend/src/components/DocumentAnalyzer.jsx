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
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Upload Section */}
      <div className="flex-shrink-0 bg-darkCard border-b border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-4">Document Analyzer</h2>
        <p className="text-gray-300 mb-6">Upload an image or PDF to analyze questions and get personalized study recommendations.</p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload Document (Image or PDF)</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {file ? (
                <div>
                  <p className="text-primary font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, or PDF (max 10MB)</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Student Profile */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Grade Level</label>
            <select
              value={studentGrade}
              onChange={(e) => setStudentGrade(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
            >
              {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              value={studentAge}
              onChange={(e) => setStudentAge(parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
              min="5"
              max="25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Areas of Weakness</label>
            <input
              type="text"
              placeholder="e.g., Algebra, Science"
              value={weakAreas}
              onChange={(e) => setWeakAreas(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className={`w-full py-2 rounded-lg font-medium transition ${
            loading || !file
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Extracted Questions */}
          {result.extracted_questions && result.extracted_questions.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-primary">📋 Questions Found</h3>
              <ul className="space-y-2">
                {result.extracted_questions.map((q, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start gap-3">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Revision Questions */}
          {result.revision_questions && result.revision_questions.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-primary">✅ Revision Questions</h3>
              <ul className="space-y-2">
                {result.revision_questions.map((q, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start gap-3">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Study Plan */}
          {result.study_plan && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-primary">📅 Recommended Study Plan</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Timeline:</span> {result.study_plan.timeline_weeks} weeks</p>
                <p><span className="font-medium">Daily Study Hours:</span> {result.study_plan.daily_study_hours} hours</p>
                {result.study_plan.estimated_readiness && (
                  <p><span className="font-medium">Readiness:</span> {result.study_plan.estimated_readiness}</p>
                )}
                {result.study_plan.topics && result.study_plan.topics.length > 0 && (
                  <div>
                    <p className="font-medium">Topics to Cover:</p>
                    <ul className="list-disc list-inside text-gray-300 mt-1">
                      {result.study_plan.topics.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Learning Materials */}
          {result.learning_materials && result.learning_materials.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-primary">📚 Recommended Learning Materials</h3>
              <div className="space-y-3">
                {result.learning_materials.map((material, idx) => (
                  <div key={idx} className="bg-dark rounded-lg p-4 border border-gray-600">
                    <h4 className="font-semibold text-white">{material.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{material.description}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-700 px-2 py-1 rounded">{material.type}</span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{material.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          {result.improvement_tips && result.improvement_tips.length > 0 && (
            <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-3 text-primary">💡 Improvement Tips</h3>
              <ul className="space-y-2">
                {result.improvement_tips.map((tip, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          {result.disclaimer && (
            <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 text-yellow-100 text-sm">
              <p className="font-semibold">📌 Disclaimer</p>
              <p>{result.disclaimer}</p>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>Upload a document to get started</p>
        </div>
      )}
    </div>
  )
}
