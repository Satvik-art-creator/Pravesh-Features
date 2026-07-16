import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { axiosInstance } from '../api/axiosInstance'

type ClassroomInfo = {
  className: string
  section: string
  subject: string
  teacherName: string
}

export function JoinClassPage() {
  const { classCode } = useParams<{ classCode: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [btechId, setBtechId] = useState('')
  
  // Validation / Join state
  const [validationErrors, setValidationErrors] = useState<{ name?: string; btechId?: string }>({})
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [joinedStudent, setJoinedStudent] = useState<{ studentName: string; className: string } | null>(null)

  useEffect(() => {
    const validateCode = async () => {
      if (!classCode) return
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(`/join/${classCode}`)
        if (response.data.success) {
          setClassroom(response.data.data)
        } else {
          setError('This invite link is invalid or has expired.')
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'This invite link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }

    validateCode()
  }, [classCode])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const errors: { name?: string; btechId?: string } = {}
    if (!name.trim()) {
      errors.name = 'Name is required'
    }
    if (!btechId.trim()) {
      errors.btechId = 'BT ID is required'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setJoinLoading(true)
    setJoinError(null)

    try {
      const response = await axiosInstance.post(`/join/${classCode}`, {
        name: name.trim(),
        btechId: btechId.trim()
      })

      if (response.data.success) {
        setJoinedStudent({
          studentName: response.data.data.studentName,
          className: response.data.data.className
        })
      }
    } catch (err: any) {
      setJoinError(err.response?.data?.message || 'Failed to join class. Please try again.')
    } finally {
      setJoinLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-zinc-500 font-medium">Validating class code...</p>
        </div>
      </div>
    )
  }

  if (error || !classroom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-950">Invalid Invite Link</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {error || 'This invite link is invalid or has expired.'}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Please ask your teacher for a correct link.
          </p>
        </div>
      </div>
    )
  }

  if (joinedStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-950">Successfully Joined!</h2>
          <p className="mt-4 text-zinc-600">
            Welcome, <span className="font-semibold text-zinc-900">{joinedStudent.studentName}</span>. You've successfully joined <span className="font-semibold text-zinc-900">{joinedStudent.className}</span>.
          </p>
          <p className="mt-6 text-xs text-zinc-400">
            You can close this tab now.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-teal-600">Classroom Join Portal</p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-950">Join Class</h2>
          <p className="mt-3 rounded-md bg-teal-50/50 p-3 text-sm text-teal-800 border border-teal-100">
            You're joining <span className="font-semibold text-zinc-950">{classroom.className}</span> ({classroom.section}) taught by <span className="font-semibold text-zinc-950">{classroom.teacherName}</span>.
          </p>
        </div>

        {joinError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {joinError}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: undefined }))
              }}
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-4 focus:ring-teal-100 transition ${
                validationErrors.name ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-teal-600'
              }`}
              disabled={joinLoading}
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              BT ID (College Roll No)
            </label>
            <input
              type="text"
              placeholder="e.g. BT23CSE041"
              value={btechId}
              onChange={(e) => {
                setBtechId(e.target.value)
                if (validationErrors.btechId) setValidationErrors(prev => ({ ...prev, btechId: undefined }))
              }}
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-4 focus:ring-teal-100 transition ${
                validationErrors.btechId ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-teal-600'
              }`}
              disabled={joinLoading}
            />
            {validationErrors.btechId && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.btechId}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={joinLoading}
          >
            {joinLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Class'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
