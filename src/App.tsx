import { useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AttendancePage } from './pages/AttendancePage'
import { ClassesPage } from './pages/ClassesPage'
import { FilesPage } from './pages/FilesPage'
import { LoginPage } from './pages/LoginPage'
import { MarksPage } from './pages/MarksPage'
import { OverviewPage } from './pages/OverviewPage'
import type { View } from './types'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeView, setActiveView] = useState<View>('overview')

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onLogout={() => setIsLoggedIn(false)}
      onViewChange={setActiveView}
    >
      {activeView === 'overview' && <OverviewPage onNavigate={setActiveView} />}
      {activeView === 'classes' && <ClassesPage />}
      {activeView === 'attendance' && <AttendancePage />}
      {activeView === 'files' && <FilesPage />}
      {activeView === 'marks' && <MarksPage />}
    </DashboardLayout>
  )
}

export default App
