import axios from 'axios'

// Use Vite proxy during development. Requests to /api will be proxied to the
// Go backend (see vite.config.js).
const API_BASE = '/api'

export const chatAPI = {
  sendMessage: async (message) => {
    const response = await axios.post(`${API_BASE}/chat`, { message })
    return response.data.reply
  },
}

export const studyAPI = {
  evaluateStudyPlan: async (goal, availableHours, durationDays, difficulty) => {
    const response = await axios.post(`${API_BASE}/agent/run`, {
      goal,
      available_hours: availableHours,
      duration_days: durationDays,
      difficulty,
    })
    return response.data
  },
}
