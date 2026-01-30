import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import StudyEvaluator from './components/StudyEvaluator'
import Header from './components/Header'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('chat') // 'chat' or 'evaluator'

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'evaluator' && <StudyEvaluator />}
        </div>
      </div>
    </div>
  )
}
