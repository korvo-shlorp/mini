import { useState, useEffect } from 'react'
import { progressAPI } from '../api'

export default function ProgressTracking() {
  const [studentID, setStudentID] = useState(localStorage.getItem('studentID') || '')
  const [showProfile, setShowProfile] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Profile form states
  const [age, setAge] = useState('')
  const [grade, setGrade] = useState('')
  const [topics, setTopics] = useState('')
  const [weakAreas, setWeakAreas] = useState('')
  const [profileEdited, setProfileEdited] = useState(false)

  useEffect(() => {
    if (studentID) {
      loadProfile()
    }
  }, [studentID])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const data = await progressAPI.getProgress(studentID)
      setProfile(data)
      setAge(data.age || '')
      setGrade(data.grade || '')
      setTopics(data.topics_studying?.join(', ') || '')
      setWeakAreas(data.weak_areas?.join(', ') || '')
      setShowProfile(true)
    } catch (error) {
      console.error('Failed to load profile:', error)
      // Create new profile if doesn't exist
      setShowProfile(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!studentID) {
      alert('Please enter a Student ID')
      return
    }

    setLoading(true)
    try {
      const topicsList = topics
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t)
      const weakAreasList = weakAreas
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a)

      const response = await progressAPI.updateProgress(
        studentID,
        parseInt(age) || 0,
        parseInt(grade) || 0,
        topicsList,
        weakAreasList
      )

      localStorage.setItem('studentID', studentID)
      setProfileEdited(false)
      loadProfile()
      alert('Profile saved successfully!')
    } catch (error) {
      alert('Failed to save profile: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fallback statistics for when profile is first created
  const getStatistics = (profile) => {
    if (!profile) {
      return {
        quizzesAttempted: 0,
        averageScore: 0,
        totalStudyHours: 0,
        currentStreak: 0,
        weeklyProgress: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          hours: 0,
        })),
      }
    }

    return {
      quizzesAttempted: profile.quizzes_attempted || 0,
      averageScore: Math.round(profile.average_score || 0),
      totalStudyHours: profile.study_hours || 0,
      currentStreak: profile.current_streak || 0,
      weeklyProgress: profile.weekly_progress || Array.from({ length: 7 }, (_, i) => ({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        hours: 0,
      })),
    }
  }

  const mockStatistics = getStatistics(profile)

  if (!showProfile) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="bg-darkCard rounded-lg p-8 border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Student ID</h2>
          <p className="text-gray-400 mb-6">Enter your student ID to view or create your profile</p>

          <input
            type="text"
            placeholder="e.g., STU123456"
            value={studentID}
            onChange={(e) => setStudentID(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white mb-4"
          />

          <button
            onClick={loadProfile}
            disabled={!studentID || loading}
            className={`w-full py-2 rounded-lg font-medium transition ${
              loading || !studentID
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Progress Tracking</h2>
          <p className="text-gray-400">Student ID: {studentID}</p>
        </div>
        <button
          onClick={() => setProfileEdited(!profileEdited)}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition"
        >
          {profileEdited ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {profileEdited ? (
        // Edit Profile Form
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-6 max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                  min="5"
                  max="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                >
                  <option value="">Select Grade</option>
                  {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topics Studying (comma-separated)</label>
              <textarea
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g., Algebra, Biology, History"
                className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Areas of Weakness (comma-separated)</label>
              <textarea
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
                placeholder="e.g., Calculus, Chemistry equations"
                className="w-full px-4 py-2 rounded-lg bg-dark border border-gray-600 text-white"
                rows="3"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-medium transition ${
                loading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      ) : (
        // Profile Overview
        <div className="grid grid-cols-2 gap-6 mb-8">
          {profile && (
            <>
              <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Age</p>
                <p className="text-2xl font-bold">{profile.age || 'Not set'}</p>
              </div>
              <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Grade Level</p>
                <p className="text-2xl font-bold">{profile.grade ? `Grade ${profile.grade}` : 'Not set'}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Quizzes Completed</p>
          <p className="text-4xl font-bold text-primary">{mockStatistics.quizzesAttempted}</p>
        </div>

        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Average Score</p>
          <p className="text-4xl font-bold text-primary">{mockStatistics.averageScore}%</p>
        </div>

        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Total Study Hours</p>
          <p className="text-4xl font-bold text-primary">{mockStatistics.totalStudyHours.toFixed(1)}</p>
        </div>

        <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">Current Streak</p>
          <p className="text-4xl font-bold text-primary">{mockStatistics.currentStreak} days 🔥</p>
        </div>
      </div>

      {/* Topics Learning */}
      {profile && profile.topics_studying && profile.topics_studying.length > 0 && (
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold mb-3">📚 Topics You're Learning</h3>
          <div className="flex flex-wrap gap-2">
            {profile.topics_studying.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-primary/20 border border-primary text-primary text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weak Areas */}
      {profile && profile.weak_areas && profile.weak_areas.length > 0 && (
        <div className="bg-darkCard rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold mb-3">⚠️ Areas for Improvement</h3>
          <ul className="space-y-2">
            {profile.weak_areas.map((area, idx) => (
              <li key={idx} className="flex items-center gap-3 text-gray-300">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly Study Chart */}
      <div className="bg-darkCard rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">📊 Weekly Study Time</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {mockStatistics.weeklyProgress.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div className="w-full bg-gray-700 rounded-t relative group hover:bg-primary transition">
                <div
                  className="bg-primary w-full rounded-t transition-all duration-300 group-hover:bg-primary-light"
                  style={{ height: `${(day.hours / 4) * 100}%`, minHeight: '8px' }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{day.day}</p>
              <p className="text-xs text-gray-500">{day.hours}h</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
