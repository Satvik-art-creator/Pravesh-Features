import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ClassesPage } from './pages/ClassesPage'
import { LoginPage } from './pages/LoginPage'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import type { View } from './types'

function App() {
  const [activeView, setActiveView] = useState<View>('classes')
  const { logout } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/" 
          element={
            <DashboardLayout
              activeView={activeView}
              onLogout={logout}
              title="Classes"
              onViewChange={setActiveView}
            >
              {activeView === 'classes' && <ClassesPage />}
            </DashboardLayout>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
