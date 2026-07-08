import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ClassCard } from '../components/classes/ClassCard'
import { ClassWorkspace } from '../components/classes/ClassWorkspace'
import { CreateClassDialog } from '../components/classes/CreateClassDialog'
import { classSummaries as initialClasses } from '../data/mockData'
import type { ClassSummary, CreateClassInput } from '../types'

export function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>(initialClasses)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const selectedClass = classes.find((item) => item.id === selectedClassId)

  const handleCreateClass = (input: CreateClassInput) => {
    const newClass: ClassSummary = {
      id: `${input.code}-${Date.now()}`.toLowerCase(),
      title: input.title,
      code: input.code,
      classCode: `${input.code.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase()}${String(Date.now()).slice(-3)}`,
      section: input.section,
      subject: input.subject,
      semester: input.semester,
      room: input.room,
      students: 0,
      present: 0,
      submissions: 0,
      color: 'bg-emerald-700',
    }

    setClasses((current) => [newClass, ...current])
    setSelectedClassId(newClass.id)
    setIsCreateOpen(false)
  }

  if (selectedClass) {
    return (
      <ClassWorkspace
        classItem={selectedClass}
        onBack={() => setSelectedClassId(null)}
      />
    )
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">Home</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              Your classes
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Create a class, open it, and manage students, attendance, files,
              assignments, and marks inside that class.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            type="button"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} />
            Create class
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onOpen={() => setSelectedClassId(classItem.id)}
          />
        ))}
      </section>

      {isCreateOpen && (
        <CreateClassDialog
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateClass}
        />
      )}
    </div>
  )
}
