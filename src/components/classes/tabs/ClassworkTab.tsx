import { BookOpen, ClipboardList, FileText, Plus } from 'lucide-react'
import { classworkItems, storedFiles } from '../../../data/mockData'
import type { ClassSummary, ClassworkItem } from '../../../types'

type ClassworkTabProps = {
  classItem: ClassSummary
}

const typeIcons: Record<ClassworkItem['type'], typeof ClipboardList> = {
  Assignment: ClipboardList,
  Material: FileText,
  Quiz: BookOpen,
}

export function ClassworkTab({ classItem }: ClassworkTabProps) {
  const items = classworkItems.filter((item) => item.className === classItem.code)
  const files = storedFiles.filter((file) => file.className === classItem.code)

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-teal-700">Classwork</p>
              <h3 className="mt-1 text-xl font-semibold text-zinc-950">
                Create work for {classItem.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Assignments, materials, quizzes, due dates, and upload
                timestamps live here.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                type="button"
              >
                <Plus size={16} />
                Assignment
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
                type="button"
              >
                <Plus size={16} />
                Material
              </button>
            </div>
          </div>
        </div>

        {items.map((item) => {
          const Icon = typeIcons[item.type]

          return (
            <article
              key={item.id}
              className="rounded-lg border border-neutral-200 bg-white p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-teal-700">
                      {item.type} - {item.topic}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      Posted {item.createdAt}
                    </p>
                    {item.dueAt && (
                      <p className="mt-1 text-sm font-medium text-zinc-700">
                        Due {item.dueAt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm font-medium text-zinc-700">
                  {item.submissions}/{item.totalStudents} submitted
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <aside className="rounded-lg border border-neutral-200 bg-white p-5">
        <p className="text-sm font-semibold text-zinc-950">Uploaded files</p>
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div key={file.name} className="rounded-md bg-neutral-50 p-3">
              <p className="text-sm font-semibold text-zinc-950">{file.name}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {file.type} - {file.size}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Uploaded {file.uploadedAt}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
