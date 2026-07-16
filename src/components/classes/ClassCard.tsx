import { GraduationCap, KeyRound } from 'lucide-react'
import { Metric } from '../common/Metric'
import type { ClassSummary } from '../../types'

type ClassCardProps = {
  classItem: ClassSummary
  onOpen: () => void
}

export function ClassCard({ classItem, onOpen }: ClassCardProps) {
  return (
    <button
      className="flex min-h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm"
      type="button"
      onClick={onOpen}
    >
      <div className={`${classItem.color} p-5 text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/80">
              {classItem.code} - {classItem.section}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{classItem.title}</h3>
            <p className="mt-1 text-sm text-white/80">
              {classItem.subject} - {classItem.room}
            </p>
          </div>
          <GraduationCap className="shrink-0 text-white/80" size={24} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center gap-2 text-sm text-zinc-600">
          <KeyRound size={16} className="text-teal-700" />
          <span>Class code: {classItem.classCode}</span>
        </div>
        <div className="flex justify-center text-center">
          <Metric label="Students" value={classItem.students} />
        </div>
        <p className="mt-auto pt-4 text-sm font-medium text-teal-700">
          Open classroom
        </p>
      </div>
    </button>
  )
}
