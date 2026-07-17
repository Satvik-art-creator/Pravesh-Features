import { useState } from 'react'
import { Copy, MailPlus, ShieldCheck, Users, X, Check } from 'lucide-react'
import { DataTable } from '../../common/DataTable'
import type { ClassSummary } from '../../../types'

type PeopleTabProps = {
  classItem: ClassSummary
  students: any[]
  loading: boolean
}

export function PeopleTab({ classItem, students, loading }: PeopleTabProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classItem.classCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-teal-50 text-teal-700">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm text-zinc-500">Teacher</p>
              <h3 className="font-semibold text-zinc-950">Prof. Demo User</h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm font-semibold text-zinc-950">Class code</p>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2">
            <span className="font-mono text-lg font-semibold text-teal-700">
              {classItem.classCode}
            </span>
            <button
              aria-label="Copy class code"
              className="rounded-md border border-neutral-200 bg-white p-2 text-zinc-600 hover:bg-neutral-100 transition flex items-center justify-center"
              type="button"
              onClick={handleCopyCode}
            >
              {codeCopied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">People</p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950">
              Students in this class
            </h3>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50 transition"
            type="button"
            onClick={() => setIsInviteOpen(true)}
          >
            <MailPlus size={16} />
            Invite students
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center bg-white rounded-lg border border-neutral-200">
            <p className="text-zinc-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-2 text-sm font-semibold text-zinc-900">No students yet</h3>
            <p className="mt-1 text-sm text-zinc-500">
              No students have joined yet — share the invite link to get started
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
              <Users size={16} />
              {students.length} {students.length === 1 ? 'student' : 'students'}
            </div>
            <DataTable
              title={`${classItem.title} people`}
              columns={['BT ID', 'Name', 'Status', 'Attendance', 'Last Activity']}
              rows={students.map((student) => {
                const isLowAttendance =
                  student.attendancePercent !== null &&
                  student.attendancePercent !== undefined &&
                  student.attendancePercent < 75

                const attendanceCell =
                  student.attendancePercent !== null &&
                  student.attendancePercent !== undefined ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-xs font-semibold border ${
                        isLowAttendance
                          ? 'bg-red-50 text-red-700 border-red-150 animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}
                    >
                      {student.attendancePercent}%
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )

                const lastActivityCell =
                  student.lastActivity !== null && student.lastActivity !== undefined ? (
                    <span className="text-xs text-zinc-600">
                      {new Date(student.lastActivity).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' '}&middot;{' '}
                      {new Date(student.lastActivity).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )

                return [
                  student.btechId,
                  student.name,
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      student.status === 'Verified'
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {student.status}
                  </span>,
                  attendanceCell,
                  lastActivityCell,
                ]
              })}
            />
          </>
        )}
      </section>

      {isInviteOpen && (
        <InviteStudentsDialog 
          classCode={classItem.classCode} 
          onClose={() => setIsInviteOpen(false)} 
        />
      )}
    </div>
  )
}

type InviteStudentsDialogProps = {
  classCode: string
  onClose: () => void
}

function InviteStudentsDialog({ classCode, onClose }: InviteStudentsDialogProps) {
  const [copied, setCopied] = useState(false)
  const joinLink = `${window.location.origin}/join/${classCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(joinLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-5 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">Classroom invite</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              Invite students
            </h2>
          </div>
          <button
            aria-label="Close invite dialog"
            className="rounded-md border border-neutral-200 p-2 text-zinc-600 hover:bg-neutral-50"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-zinc-600">
            Share this link with students to let them join the classroom.
          </p>
          <div className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2 border border-neutral-200">
            <span className="font-mono text-sm text-teal-800 break-all select-all">
              {joinLink}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 w-28"
            type="button"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>
    </div>
  )
}
