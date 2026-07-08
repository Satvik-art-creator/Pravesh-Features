import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  MessageSquareText,
  QrCode,
  Users,
} from 'lucide-react'
import { Metric } from '../common/Metric'
import { AttendanceTab } from './tabs/AttendanceTab'
import { ClassworkTab } from './tabs/ClassworkTab'
import { GradesTab } from './tabs/GradesTab'
import { PeopleTab } from './tabs/PeopleTab'
import { StreamTab } from './tabs/StreamTab'
import type { ClassSummary } from '../../types'

type ClassTab = 'stream' | 'classwork' | 'people' | 'grades' | 'attendance'

const classTabs: { id: ClassTab; label: string; icon: typeof Users }[] = [
  { id: 'stream', label: 'Stream', icon: MessageSquareText },
  { id: 'classwork', label: 'Classwork', icon: BookOpen },
  { id: 'people', label: 'People', icon: Users },
  { id: 'grades', label: 'Grades', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: QrCode },
]

type ClassWorkspaceProps = {
  classItem: ClassSummary
  onBack: () => void
}

export function ClassWorkspace({ classItem, onBack }: ClassWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<ClassTab>('stream')

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className={`${classItem.color} p-5 text-white sm:p-6`}>
          <button
            className="mb-5 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium hover:bg-white/25"
            type="button"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back to classes
          </button>
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
          {classTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-zinc-600 hover:bg-neutral-100 hover:text-zinc-950'
                }`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      {activeTab === 'stream' && <StreamTab classItem={classItem} />}
      {activeTab === 'classwork' && <ClassworkTab classItem={classItem} />}
      {activeTab === 'people' && <PeopleTab classItem={classItem} />}
      {activeTab === 'grades' && <GradesTab classItem={classItem} />}
      {activeTab === 'attendance' && <AttendanceTab classItem={classItem} />}
    </div>
  )
}
