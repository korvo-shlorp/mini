import { useState, useRef } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleSend = (e) => {
    e.preventDefault()
    if (message.trim() || files.length > 0) {
      onSend(message, files)
      setMessage('')
      setFiles([])
    }
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []))
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-darkCard border-t border-gray-700 p-4">
      {/* File List */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 flex items-center gap-2"
            >
              <span>📎</span>
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(idx)}
                className="hover:text-white"
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-3 items-flex-end">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
          aria-label="Upload file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
        />

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          disabled={disabled}
          className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!message.trim() && files.length === 0)}
          className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  )
}
