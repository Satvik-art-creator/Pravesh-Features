import { ArrowDownToLine } from 'lucide-react'
import { markRecords } from '../../../data/mockData'
import type { ClassSummary } from '../../../types'

type GradesTabProps = {
  classItem: ClassSummary
}

export function GradesTab({ classItem }: GradesTabProps) {
  const classMarks = markRecords.filter((mark) => mark.className === classItem.code)

  const exportCsv = () => {
    const header = ['BT ID', 'Name', 'Midterm', 'Assignment', 'Final', 'Total']
    const rows = classMarks.map((mark) => [
      mark.id,
      mark.name,
      mark.mid,
      mark.assignment,
      mark.final,
      mark.mid + mark.assignment + mark.final,
    ])
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${classItem.code}-grades-export.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-teal-700">Grades</p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950">
              Enter grades and export CSV
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Editable grade table for {classItem.title}. Backend save will come
              later.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            type="button"
            onClick={exportCsv}
          >
            <ArrowDownToLine size={16} />
            Export CSV
          </button>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-zinc-500">
              <tr>
                {['BT ID', 'Name', 'Midterm', 'Assignment', 'Final', 'Total'].map(
                  (head) => (
                    <th key={head} className="px-4 py-3 font-semibold">
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {classMarks.map((mark) => (
                <tr key={mark.id}>
                  <td className="px-4 py-3 font-medium text-zinc-950">
                    {mark.id}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{mark.name}</td>
                  {[mark.mid, mark.assignment, mark.final].map((score, index) => (
                    <td key={`${mark.id}-${index}`} className="px-4 py-3">
                      <input
                        className="w-20 rounded-md border border-neutral-300 px-2 py-1 outline-none focus:border-teal-600"
                        defaultValue={score}
                        type="number"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 font-semibold text-teal-700">
                    {mark.mid + mark.assignment + mark.final}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
