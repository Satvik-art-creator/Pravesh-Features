import { CalendarDays, QrCode } from 'lucide-react'
import { DataTable } from '../../common/DataTable'
import { MockQr } from '../../common/MockQr'
import { Step } from '../../common/Step'
import { attendanceSessions, students } from '../../../data/mockData'
import type { ClassSummary } from '../../../types'

type AttendanceTabProps = {
  classItem: ClassSummary
}

export function AttendanceTab({ classItem }: AttendanceTabProps) {
  const classStudents = students.filter(
    (student) => student.className === classItem.code,
  )
  const sessions = attendanceSessions.filter(
    (session) => session.className === classItem.code,
  )
  const latestSession = sessions[0]

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Live session</p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950">
              Generate attendance QR
            </h3>
          </div>
          <QrCode className="text-teal-700" size={24} />
        </div>

        <div className="my-6 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
          <MockQr />
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Lecture date
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-teal-600"
                defaultValue="2026-07-08"
                type="date"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Start time
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-teal-600"
                defaultValue="09:00"
                type="time"
              />
            </label>
          </div>
          <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-zinc-600">
            Works only on IIITN campus network. Session is saved with lecture
            date and time.
          </div>
          <button
            className="w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700"
            type="button"
          >
            Generate QR for this class
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-semibold text-zinc-950">
              Attendance flow
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Student scans the class QR, opens secure link, enters BT ID, and
              gets marked for this class only.
            </p>
          </div>
          {latestSession && (
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {latestSession.marked}/{latestSession.totalStudents} marked on{' '}
              {latestSession.lectureDate}
            </span>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Step number="1" title="Teacher opens class session" />
          <Step number="2" title="Students scan class QR" />
          <Step number="3" title="BT ID marks attendance" />
        </div>

        <div className="mt-6">
          <DataTable
            title="Latest attendance marks"
            columns={['BT ID', 'Name', 'Status', 'Time']}
            rows={classStudents.map((student) => [
              student.id,
              student.name,
              'Marked',
              student.lastLogin,
            ])}
          />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 xl:col-span-2">
        <div className="mb-4 flex items-center gap-2 text-teal-700">
          <CalendarDays size={18} />
          <h3 className="text-lg font-semibold text-zinc-950">
            Lecture attendance sessions
          </h3>
        </div>
        <DataTable
          title="Attendance session history"
          columns={['Lecture date', 'Started at', 'Marked', 'Status']}
          rows={sessions.map((session) => [
            session.lectureDate,
            session.startedAt,
            `${session.marked}/${session.totalStudents}`,
            session.status,
          ])}
        />
      </section>
    </div>
  )
}
