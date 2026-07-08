import { Copy, MailPlus, ShieldCheck, Users } from 'lucide-react'
import { DataTable } from '../../common/DataTable'
import { students } from '../../../data/mockData'
import type { ClassSummary } from '../../../types'

type PeopleTabProps = {
  classItem: ClassSummary
}

export function PeopleTab({ classItem }: PeopleTabProps) {
  const classStudents = students.filter(
    (student) => student.className === classItem.code,
  )

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
              className="rounded-md border border-neutral-200 bg-white p-2 text-zinc-600 hover:bg-neutral-100"
              type="button"
            >
              <Copy size={16} />
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
            className="inline-flex items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
            type="button"
          >
            <MailPlus size={16} />
            Invite students
          </button>
        </div>
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-500">
          <Users size={16} />
          {classStudents.length} students currently visible in mock data
        </div>
        <DataTable
          title={`${classItem.title} people`}
          columns={['BT ID', 'Name', 'Status', 'Attendance', 'Last login']}
          rows={classStudents.map((student) => [
            student.id,
            student.name,
            student.status,
            student.attendance,
            student.lastLogin,
          ])}
        />
      </section>
    </div>
  )
}
