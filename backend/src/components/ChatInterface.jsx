import { useState, useRef, useEffect } from 'react'
import { chatAPI } from '../api'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestionBox from './SuggestionBox'

const SUGGESTIONS = [
  'How should I structure my study schedule?',
  'What are effective study techniques?',
  'How do I manage exam anxiety?',
  'Tell me about the Pomodoro technique',
]

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message, files) => {
    if (!message.trim() && files.length === 0) return

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: message,
      files: files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setError('')
    setLoading(true)

    try {
      // Call backend chat API
      const reply = await chatAPI.sendMessage(message)

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion, [])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold mb-2">Welcome to StudyAI</h2>
              <p className="text-gray-400 mb-8">Your personal study assistant is here to help. Ask anything about studying, learning strategies, or academic topics.</p>

              {/* Suggestions */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">Try asking:</p>
                {SUGGESTIONS.map((suggestion, idx) => (
                  <SuggestionBox key={idx} text={suggestion} onClick={() => handleSuggestionClick(suggestion)} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  )
}
