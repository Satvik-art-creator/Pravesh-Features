import { GraduationCap } from 'lucide-react'
import { DataTable } from '../components/common/DataTable'
import { Metric } from '../components/common/Metric'
import { classSummaries, students } from '../data/mockData'

export function ClassesPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">Student entry URL</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">
              One link for student BT ID login
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              This is only the UI state. Backend validation and student profile
              fetching will come later.
            </p>
          </div>
          <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-zinc-700">
            pravesh.iiitn.ac.in/student-login
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {classSummaries.map((item) => (
          <div
            key={item.code}
            className="rounded-lg border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700">
                  {item.code}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{item.semester}</p>
              </div>
              <GraduationCap className="text-zinc-400" size={22} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <Metric label="Students" value={item.students} />
              <Metric label="Present" value={item.present} />
              <Metric label="Uploads" value={item.submissions} />
            </div>
          </div>
        ))}
      </section>

      <DataTable
        title="Recent student logins"
        columns={['BT ID', 'Name', 'Class', 'Status', 'Attendance', 'Last login']}
        rows={students.map((student) => [
          student.id,
          student.name,
          student.className,
          student.status,
          student.attendance,
          student.lastLogin,
        ])}
      />
    </div>
  )
}
