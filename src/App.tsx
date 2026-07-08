import { useState } from 'react'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ClassesPage } from './pages/ClassesPage'
import { LoginPage } from './pages/LoginPage'
import type { View } from './types'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeView, setActiveView] = useState<View>('classes')

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onLogout={() => setIsLoggedIn(false)}
      title="Classes"
      onViewChange={setActiveView}
    >
      {activeView === 'classes' && <ClassesPage />}
    </DashboardLayout>
  )
}

export default App
