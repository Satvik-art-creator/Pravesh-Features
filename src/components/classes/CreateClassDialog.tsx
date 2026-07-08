import { useState } from 'react'
import { X } from 'lucide-react'
import type { CreateClassInput } from '../../types'

type CreateClassDialogProps = {
  onClose: () => void
  onCreate: (input: CreateClassInput) => void
}

export function CreateClassDialog({
  onClose,
  onCreate,
}: CreateClassDialogProps) {
  const [form, setForm] = useState<CreateClassInput>({
    title: '',
    code: '',
    section: '',
    subject: '',
    semester: '',
    room: '',
  })

  const canCreate = Object.values(form).every((value) => value.trim().length > 0)

  const updateField = (field: keyof CreateClassInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
      <form
        className="w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-5 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault()
          if (canCreate) {
            onCreate(form)
          }
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">New classroom</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              Create class
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Frontend-only creation. It stays in local UI state for now.
            </p>
          </div>
          <button
            aria-label="Close create class dialog"
            className="rounded-md border border-neutral-200 p-2 text-zinc-600 hover:bg-neutral-50"
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Class name"
            placeholder="Data Structures"
            value={form.title}
            onChange={(value) => updateField('title', value)}
          />
          <TextField
            label="Class code"
            placeholder="CSE-A"
            value={form.code}
            onChange={(value) => updateField('code', value)}
          />
          <TextField
            label="Section"
            placeholder="Section A"
            value={form.section}
            onChange={(value) => updateField('section', value)}
          />
          <TextField
            label="Subject"
            placeholder="Computer Science"
            value={form.subject}
            onChange={(value) => updateField('subject', value)}
          />
          <TextField
            label="Semester"
            placeholder="Semester 3"
            value={form.semester}
            onChange={(value) => updateField('semester', value)}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Room"
              placeholder="AB-204"
              value={form.room}
              onChange={(value) => updateField('room', value)}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            disabled={!canCreate}
            type="submit"
          >
            Create class
          </button>
        </div>
      </form>
    </div>
  )
}

type TextFieldProps = {
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}

function TextField({ label, onChange, placeholder, value }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      <input
        className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
