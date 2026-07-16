import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ClassCard } from '../components/classes/ClassCard'
import { CreateClassDialog } from '../components/classes/CreateClassDialog'
import type { ClassSummary } from '../types'
import { axiosInstance } from '../api/axiosInstance'

export function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const navigate = useNavigate()

  const fetchClassrooms = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get('/classroom')
      if (response.data.success) {
        const mappedClasses: ClassSummary[] = response.data.data.map((c: any) => ({
          id: c._id,
          code: c.classCode,
          title: c.className,
          section: c.section,
          subject: c.subject,
          semester: c.semester,
          room: c.room,
          classCode: c.classCode,
          students: c.studentsCount,
          present: 0,
          submissions: 0,
          color: 'bg-emerald-700',
        }))
        setClasses(mappedClasses)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load classrooms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClassrooms()
  }, [])

  const handleClassCreated = () => {
    setIsCreateOpen(false)
    fetchClassrooms()
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">Home</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              Your classes
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Create a class, open it, and manage students, attendance, files,
              assignments, and marks inside that class.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} />
            Create class
          </button>
        </div>
      </section>

      {error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchClassrooms}
            className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-neutral-200 bg-white p-8">
          <p className="text-zinc-500">Loading classrooms...</p>
        </div>
      )}

      {!error && !loading && classes.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <h3 className="mb-2 text-lg font-medium text-zinc-900">No classes yet</h3>
          <p className="mb-6 max-w-md text-zinc-500">
            You haven't created any classes yet — click 'Create class' to get started and set up your first classroom.
          </p>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} />
            Create class
          </button>
        </div>
      )}

      {!error && !loading && classes.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onOpen={() => navigate(`/classroom/${classItem.id}`)}
            />
          ))}
        </section>
      )}

      {isCreateOpen && (
        <CreateClassDialog
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleClassCreated}
        />
      )}
    </div>
  )
}
