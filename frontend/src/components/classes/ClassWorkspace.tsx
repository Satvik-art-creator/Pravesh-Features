import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  ClipboardList,
  MessageSquareText,
  QrCode,
  Users,
  Trash2,
  Loader2,
  X,
} from 'lucide-react'
import { Metric } from '../common/Metric'
import { AttendanceTab } from './tabs/AttendanceTab'
import { GradesTab } from './tabs/GradesTab'
import { PeopleTab } from './tabs/PeopleTab'
import { StreamTab } from './tabs/StreamTab'
import type { ClassSummary } from '../../types'
import { axiosInstance } from '../../api/axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'

type ClassTab = 'stream' | 'people' | 'grades' | 'attendance'

const classTabs: { id: ClassTab; label: string; icon: typeof Users }[] = [
  { id: 'stream', label: 'Stream', icon: MessageSquareText },
  { id: 'people', label: 'People', icon: Users },
  { id: 'grades', label: 'Grades', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: QrCode },
]

type ClassWorkspaceProps = {
  classItem: ClassSummary
  onBack: () => void
}

export function ClassWorkspace({ classItem, onBack }: ClassWorkspaceProps) {
  const { tab } = useParams<{ tab: string }>()
  const navigate = useNavigate()
  const activeTab = (tab as ClassTab) || 'stream'
  const [students, setStudents] = useState<any[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentsLoaded, setStudentsLoaded] = useState(false)

  // Delete classroom states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchStudents = async () => {
    setLoadingStudents(true)
    try {
      const response = await axiosInstance.get(`/classroom/${classItem.id}/students`)
      if (response.data.success) {
        setStudents(response.data.data)
        setStudentsLoaded(true)
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'people' && !studentsLoaded) {
      fetchStudents()
    }
  }, [activeTab, studentsLoaded, classItem.id])

  const handleConfirmDelete = async () => {
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const response = await axiosInstance.delete(`/classroom/${classItem.id}`)
      if (response.data.success) {
        setIsDeleteDialogOpen(false)
        onBack() // Navigates back to dashboard/classes list
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete classroom. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className={`${classItem.color} p-5 text-white sm:p-6`}>
          <div className="flex justify-between items-center mb-5">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25 transition"
              type="button"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              Back to classes
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-red-600/30 border border-red-500/20 px-3 py-2 text-sm font-medium hover:bg-red-600/50 text-red-100 transition"
              type="button"
              onClick={() => {
                setDeleteError(null)
                setIsDeleteDialogOpen(true)
              }}
            >
              <Trash2 size={16} className="text-red-200" />
              Delete Classroom
            </button>
          </div>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-white/80">
                {classItem.code} - {classItem.section}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{classItem.title}</h2>
              <p className="mt-2 text-sm text-white/80">
                {classItem.subject} - {classItem.semester} - Room{' '}
                {classItem.room}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-zinc-950 sm:w-96">
              <Metric label="Students" value={classItem.students} />
              <Metric label="Class code" value={classItem.classCode} />
              <Metric label="Uploads" value={classItem.submissions} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 px-4 py-3">
          {classTabs.map((tabItem) => {
            const Icon = tabItem.icon
            const isActive = activeTab === tabItem.id

            return (
              <button
                key={tabItem.id}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-zinc-600 hover:bg-neutral-100 hover:text-zinc-950'
                }`}
                type="button"
                onClick={() => navigate(`/classroom/${classItem.id}/${tabItem.id}`)}
              >
                <Icon size={16} />
                {tabItem.label}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'stream' && <StreamTab classItem={classItem} />}
      {activeTab === 'people' && (
        <PeopleTab 
          classItem={classItem} 
          students={students} 
          loading={loadingStudents} 
        />
      )}
      {activeTab === 'grades' && <GradesTab classItem={classItem} />}
      {activeTab === 'attendance' && <AttendanceTab classItem={classItem} />}

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-600">Delete classroom</p>
                <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                  Are you sure?
                </h2>
              </div>
              <button
                aria-label="Close delete dialog"
                className="rounded-md border border-neutral-200 p-2 text-zinc-600 hover:bg-neutral-50 transition"
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                <X size={18} />
              </button>
            </div>

            {deleteError && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {deleteError}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-sm text-zinc-600 leading-relaxed">
                Delete <span className="font-semibold text-zinc-950">{classItem.title}</span>? This will permanently remove all students, attendance records, grades, and files associated with this class.
              </p>
              <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-md p-3">
                Warning: This action is irreversible and cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50 disabled:opacity-50 transition"
                type="button"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-neutral-300 transition"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                type="button"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Classroom'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
