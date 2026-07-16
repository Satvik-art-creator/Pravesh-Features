import { useState } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ClassesPage } from './pages/ClassesPage'
import { LoginPage } from './pages/LoginPage'
import { ClassroomDetailPlaceholder } from './pages/ClassroomDetailPlaceholder'
import { JoinClassPage } from './pages/JoinClassPage'
import { AttendScanPage } from './pages/AttendScanPage'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import type { View } from './types'

function ClassroomRedirect() {
  const { id } = useParams<{ id: string }>()
  return <Navigate to={`/classroom/${id}/stream`} replace />
}

function App() {
  const [activeView, setActiveView] = useState<View>('classes')
  const { logout } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join/:classCode" element={<JoinClassPage />} />
      <Route path="/attend/:sessionId" element={<AttendScanPage />} />
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
        <Route 
          path="/classroom/:id/:tab" 
          element={
            <DashboardLayout
              activeView={activeView}
              onLogout={logout}
              title="Classroom"
              onViewChange={setActiveView}
            >
              <ClassroomDetailPlaceholder />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/classroom/:id" 
          element={<ClassroomRedirect />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
