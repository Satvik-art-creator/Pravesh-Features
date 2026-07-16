import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { axiosInstance } from '../api/axiosInstance'
import { ClassWorkspace } from '../components/classes/ClassWorkspace'
import type { ClassSummary } from '../types'

export function ClassroomDetailPlaceholder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [classroom, setClassroom] = useState<ClassSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClassroom = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(`/classroom/${id}`)
        if (response.data.success) {
          const c = response.data.data
          const mappedClass: ClassSummary = {
            id: c._id,
            code: c.classCode,
            classCode: c.classCode,
            title: c.className,
            section: c.section,
            subject: c.subject,
            semester: c.semester || '',
            room: c.room || '',
            students: c.students ? c.students.length : 0,
            present: 0,
            submissions: 0,
            color: 'bg-emerald-700',
          }
          setClassroom(mappedClass)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load classroom details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClassroom()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-zinc-500">Loading classroom...</p>
      </div>
    )
  }

  if (error || !classroom) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center bg-zinc-50">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 self-start rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm border border-neutral-200 hover:bg-neutral-50"
        >
          <ArrowLeft size={16} /> Back to dashboard
        </button>
        <p className="text-xl text-red-600 mb-4">{error || 'Classroom not found'}</p>
      </div>
    )
  }

  return (
    <ClassWorkspace 
      classItem={classroom} 
      onBack={() => navigate('/')} 
    />
  )
}
