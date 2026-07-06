import { CalendarCheck, ClipboardList, FolderOpen, QrCode, Users } from 'lucide-react'
import { ActionCard } from '../components/common/ActionCard'
import type { View } from '../types'

type OverviewPageProps = {
  onNavigate: (view: View) => void
}

const stats = [
  { label: 'Total students', value: '173', change: '+12 logged today' },
  { label: 'Attendance today', value: '90%', change: '156 marked' },
  { label: 'Open assignments', value: '7', change: '3 due this week' },
  { label: 'Pending marks', value: '21', change: 'Need review' },
]

const activity = [
  'CSE-A attendance QR generated at 09:00 AM',
  '41 students submitted Data Structures assignment',
  'DBMS Unit 2 notes uploaded for CSE-B',
  'AIML midterm marks draft saved',
]

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-zinc-950">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-teal-700">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-teal-700">
                Quick workflow
              </p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                What teachers can manage
              </h2>
            </div>
            <span className="rounded-md bg-neutral-100 px-3 py-1 text-sm text-zinc-600">
              Frontend design only
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <ActionCard
              icon={Users}
              title="Class student data"
              body="Students open a single URL, enter BT ID, and their information appears for teacher review."
              onClick={() => onNavigate('classes')}
            />
            <ActionCard
              icon={QrCode}
              title="QR attendance"
              body="Teacher generates QR. Students scan, open link, enter ID, and attendance is marked on IIITN network."
              onClick={() => onNavigate('attendance')}
            />
            <ActionCard
              icon={FolderOpen}
              title="Notes and assignments"
              body="Teacher uploads notes. Students can submit assignment files from the student side later."
              onClick={() => onNavigate('files')}
            />
            <ActionCard
              icon={ClipboardList}
              title="Marks and CSV"
              body="Teacher enters marks quickly and exports all rows as CSV for records."
              onClick={() => onNavigate('marks')}
            />
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-950">
              Today activity
            </h2>
            <CalendarCheck className="text-teal-700" size={20} />
          </div>
          <div className="space-y-4">
            {activity.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-1 size-2 rounded-full bg-teal-600" />
                <p className="text-sm text-zinc-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
