import { BookOpen, FileText, UploadCloud } from 'lucide-react'
import { storedFiles } from '../data/mockData'

export function FilesPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-teal-700">Notes storage</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">
                Shared class files
              </h2>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              type="button"
            >
              <UploadCloud size={16} />
              Upload notes
            </button>
          </div>
          <div className="grid gap-3">
            {storedFiles.map((file) => (
              <div
                key={file.name}
                className="flex flex-col gap-3 rounded-md border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-neutral-100 text-teal-700">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-950">{file.name}</p>
                    <p className="text-sm text-zinc-500">
                      {file.type} - {file.className}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-zinc-600">
                  {file.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-neutral-200 bg-white p-5">
        <BookOpen className="text-teal-700" size={24} />
        <h2 className="mt-3 text-xl font-semibold text-zinc-950">
          Assignment upload area
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Student-side upload can be connected later. For design, this panel
          shows how teacher creates an assignment submission slot.
        </p>
        <div className="mt-5 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
          <UploadCloud className="mx-auto text-zinc-400" size={28} />
          <p className="mt-3 text-sm font-medium text-zinc-700">
            Drag assignment brief here
          </p>
          <p className="mt-1 text-xs text-zinc-500">PDF, DOCX, ZIP supported UI</p>
        </div>
        <button
          className="mt-5 w-full rounded-md border border-neutral-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
          type="button"
        >
          Create assignment slot
        </button>
      </aside>
    </div>
  )
}
