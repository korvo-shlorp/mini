export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 animate-slideUp ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-sm">
          🤖
        </div>
      )}

      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-gray-800 text-gray-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm md:text-base">{message.content}</p>

        {/* File Attachments */}
        {message.files && message.files.length > 0 && (
          <div className="mt-2 space-y-2 pt-2 border-t border-gray-600">
            {message.files.map((file, idx) => (
              <div key={idx} className="text-xs opacity-70 flex items-center gap-2">
                <span>📎</span>
                {file.name}
                {file.size && <span className="text-gray-400">({(file.size / 1024).toFixed(1)}KB)</span>}
              </div>
            ))}
          </div>
        )}

        <p className={`text-xs mt-1 ${isUser ? 'opacity-70' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-sm">
          👤
        </div>
      )}
    </div>
  )
}
