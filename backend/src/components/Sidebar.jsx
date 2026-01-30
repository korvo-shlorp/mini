export default function Sidebar({ isOpen, onClose, onTabChange, activeTab }) {
  const menuItems = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'evaluator', label: 'Study Evaluator', icon: '📚' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-darkCard border-r border-gray-700
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Close Button (Mobile) */}
        <div className="lg:hidden p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-primary">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg font-medium
                transition-all duration-200 flex items-center gap-3
                ${
                  activeTab === item.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">StudyAI v1.0</p>
        </div>
      </aside>
    </>
  )
}
