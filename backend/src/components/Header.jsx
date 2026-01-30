export default function Header({ onMenuClick, sidebarOpen }) {
  return (
    <header className="bg-darkCard border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <button
        onClick={onMenuClick}
        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all"
        aria-label="Toggle menu"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${sidebarOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
        StudyAI
      </h1>
      <div className="w-8" /> {/* Spacer for centering */}
    </header>
  )
}
