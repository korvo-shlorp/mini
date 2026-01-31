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

export const mediaAPI = {
  analyzeImage: async (imageData, imageType, studentGrade, studentAge, weakAreas) => {
    const response = await axios.post(`${API_BASE}/analyze-image`, {
      image_data: imageData,
      image_type: imageType,
      student_grade: studentGrade,
      student_age: studentAge,
      weak_areas: weakAreas,
    })
    return response.data
  },

  generateQuiz: async (topicName, difficulty, numQuestions, timedMinutes = 0) => {
    const response = await axios.post(`${API_BASE}/generate-quiz`, {
      topic_name: topicName,
      difficulty,
      num_questions: numQuestions,
      timed_minutes: timedMinutes,
    })
    return response.data
  },

  submitQuiz: async (quizID, answers, timeSpent, questions = []) => {
    const response = await axios.post(`${API_BASE}/submit-quiz`, {
      quiz_id: quizID,
      answers,
      time_spent: timeSpent,
      questions,
    })
    return response.data
  },
}

export const progressAPI = {
  getProgress: async (studentID) => {
    const response = await axios.get(`${API_BASE}/progress?student_id=${studentID}`)
    return response.data
  },

  updateProgress: async (studentID, age, grade, topics, weakAreas) => {
    const response = await axios.post(`${API_BASE}/update-progress`, {
      student_id: studentID,
      age,
      grade,
      topics_studying: topics,
      weak_areas: weakAreas,
    })
    return response.data
  },
}
