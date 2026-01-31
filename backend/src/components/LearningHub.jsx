import { useState } from 'react'

export default function LearningHub() {
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [subtopics, setSubtopics] = useState([])
  const [currentLesson, setCurrentLesson] = useState(null)

  const topics = [
    {
      id: 'math',
      name: '📐 Mathematics',
      color: 'bg-blue-900',
      subtopics: [
        { id: 'algebra', name: 'Algebra', description: 'Equations, variables, and functions' },
        { id: 'geometry', name: 'Geometry', description: 'Shapes, angles, and proofs' },
        { id: 'calculus', name: 'Calculus', description: 'Limits, derivatives, and integrals' },
      ],
    },
    {
      id: 'science',
      name: '🔬 Science',
      color: 'bg-green-900',
      subtopics: [
        { id: 'biology', name: 'Biology', description: 'Living organisms and ecosystems' },
        { id: 'chemistry', name: 'Chemistry', description: 'Elements, reactions, and bonds' },
        { id: 'physics', name: 'Physics', description: 'Forces, energy, and motion' },
      ],
    },
    {
      id: 'history',
      name: '📚 History',
      color: 'bg-purple-900',
      subtopics: [
        { id: 'ancient', name: 'Ancient Civilizations', description: 'Egypt, Rome, Greece' },
        { id: 'medieval', name: 'Medieval Period', description: 'Middle Ages and Renaissance' },
        { id: 'modern', name: 'Modern History', description: 'Recent historical events' },
      ],
    },
    {
      id: 'languages',
      name: '🌍 Languages',
      color: 'bg-pink-900',
      subtopics: [
        { id: 'english', name: 'English', description: 'Literature, grammar, and writing' },
        { id: 'spanish', name: 'Spanish', description: 'Vocabulary and grammar' },
        { id: 'french', name: 'French', description: 'Communication and culture' },
      ],
    },
  ]

  const lessons = {
    algebra: [
      { id: 1, title: 'Variables and Expressions', difficulty: 'beginner' },
      { id: 2, title: 'Solving Linear Equations', difficulty: 'beginner' },
      { id: 3, title: 'Systems of Equations', difficulty: 'intermediate' },
      { id: 4, title: 'Quadratic Equations', difficulty: 'advanced' },
    ],
    geometry: [
      { id: 1, title: 'Basic Shapes and Properties', difficulty: 'beginner' },
      { id: 2, title: 'Angles and Triangles', difficulty: 'intermediate' },
      { id: 3, title: 'Proofs and Theorems', difficulty: 'advanced' },
    ],
    biology: [
      { id: 1, title: 'Cell Structure', difficulty: 'beginner' },
      { id: 2, title: 'Photosynthesis and Respiration', difficulty: 'intermediate' },
      { id: 3, title: 'Genetics and Inheritance', difficulty: 'advanced' },
    ],
  }

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.id)
    setSubtopics(topic.subtopics)
    setCurrentLesson(null)
  }

  const handleSelectSubtopic = (subtopicId) => {
    const lessonList = lessons[subtopicId] || []
    setCurrentLesson({
      subtopicId,
      lessons: lessonList,
      selectedLesson: null,
    })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-700'
      case 'intermediate':
        return 'bg-yellow-700'
      case 'advanced':
        return 'bg-red-700'
      default:
        return 'bg-gray-700'
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {!selectedTopic ? (
        // Topic Selection View
        <div className="flex flex-col h-full overflow-y-auto p-6">
          <h2 className="text-3xl font-bold mb-2">Learning Hub</h2>
          <p className="text-gray-400 mb-6">Choose a topic to start learning</p>

          <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`${topic.color} rounded-lg p-6 text-left hover:shadow-lg transition transform hover:scale-105`}
              >
                <h3 className="text-2xl font-bold mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-200">{topic.subtopics.length} subtopics available</p>
              </button>
            ))}
          </div>
        </div>
      ) : !currentLesson ? (
        // Subtopic Selection View
        <div className="flex flex-col h-full overflow-y-auto p-6">
          <button
            onClick={() => setSelectedTopic(null)}
            className="mb-4 text-primary hover:text-primary-light flex items-center gap-2"
          >
            ← Back to Topics
          </button>

          <h2 className="text-3xl font-bold mb-6">
            {topics.find((t) => t.id === selectedTopic)?.name}
          </h2>

          <div className="space-y-3">
            {subtopics.map((subtopic) => (
              <button
                key={subtopic.id}
                onClick={() => handleSelectSubtopic(subtopic.id)}
                className="w-full bg-darkCard border border-gray-700 rounded-lg p-4 text-left hover:border-primary transition"
              >
                <h3 className="text-lg font-semibold mb-1">{subtopic.name}</h3>
                <p className="text-gray-400 text-sm">{subtopic.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Lesson View
        <div className="flex flex-col h-full overflow-hidden">
          <div className="bg-darkCard border-b border-gray-700 p-6">
            <button
              onClick={() => setCurrentLesson(null)}
              className="mb-4 text-primary hover:text-primary-light flex items-center gap-2"
            >
              ← Back to Subtopics
            </button>
            <h2 className="text-2xl font-bold">
              {subtopics.find((s) => s.id === currentLesson.subtopicId)?.name}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentLesson.lessons.length > 0 ? (
              <div className="space-y-3">
                {currentLesson.lessons.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="bg-darkCard border border-gray-700 rounded-lg p-4 hover:border-primary transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">
                          {idx + 1}. {lesson.title}
                        </h3>
                        <span
                          className={`inline-block text-xs px-2 py-1 rounded ${getDifficultyColor(
                            lesson.difficulty
                          )}`}
                        >
                          {lesson.difficulty}
                        </span>
                      </div>
                      <span className="text-primary text-2xl">→</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No lessons available yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
