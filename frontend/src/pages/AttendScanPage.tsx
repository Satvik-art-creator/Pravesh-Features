import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, Loader2, Clock } from 'lucide-react'
import { axiosInstance } from '../api/axiosInstance'

type SessionInfo = {
  className: string
  subject: string
}

export function AttendScanPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  // Form state
  const [btechId, setBtechId] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const validateSession = async () => {
      if (!sessionId) return
      setLoading(true)
      setError(null)
      setExpired(false)
      try {
        const response = await axiosInstance.get(`/attendance/scan/${sessionId}`)
        if (response.data.success) {
          setSessionInfo(response.data.data)
        } else {
          setError('Invalid attendance link.')
        }
      } catch (err: any) {
        if (err.response?.status === 410) {
          setExpired(true)
        } else {
          setError(err.response?.data?.message || 'Invalid attendance link.')
        }
      } finally {
        setLoading(false)
      }
    }

    validateSession()
  }, [sessionId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!btechId.trim()) {
      setValidationError('BT ID is required')
      return
    }

    setValidationError(null)
    setSubmitLoading(true)
    setSubmitError(null)

    try {
      const response = await axiosInstance.post(`/attendance/scan/${sessionId}`, {
        btechId: btechId.trim()
      })

      if (response.data.success) {
        setSuccessMessage(response.data.message)
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to mark attendance. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-zinc-500 font-medium">Validating session...</p>
        </div>
      </div>
    )
  }

  // Expired state
  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-950">Session Expired</h2>
          <p className="mt-2 text-sm text-zinc-600">
            This attendance session has expired. Please ask your teacher for a new QR code.
          </p>
        </div>
      </div>
    )
  }

  // Error/invalid state
  if (error || !sessionInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-950">Invalid Attendance Link</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {error || 'Invalid attendance link.'}
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Please scan a valid QR code from your teacher.
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (successMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-zinc-950">Attendance Marked!</h2>
          <p className="mt-4 text-zinc-600">{successMessage}</p>
          <p className="mt-6 text-xs text-zinc-400">
            You can close this tab now.
          </p>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-teal-600">Attendance Portal</p>
          <h2 className="mt-1 text-2xl font-bold text-zinc-950">Mark Attendance</h2>
          <p className="mt-3 rounded-md bg-teal-50/50 p-3 text-sm text-teal-800 border border-teal-100">
            Marking attendance for <span className="font-semibold text-zinc-950">{sessionInfo.className}</span> — {sessionInfo.subject}
          </p>
        </div>

        {submitError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                if (validationError) setValidationError(null)
                if (submitError) setSubmitError(null)
              }}
              className={`w-full rounded-md border px-3 py-2 outline-none focus:ring-4 focus:ring-teal-100 transition ${
                validationError ? 'border-red-300 focus:border-red-500' : 'border-neutral-300 focus:border-teal-600'
              }`}
              disabled={submitLoading}
              autoFocus
            />
            {validationError && (
              <p className="mt-1 text-xs text-red-500">{validationError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Marking...
              </>
            ) : (
              'Mark Attendance'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
