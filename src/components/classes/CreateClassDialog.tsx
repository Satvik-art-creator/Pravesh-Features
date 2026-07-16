import { useState } from 'react'
import { X } from 'lucide-react'
import type { CreateClassInput } from '../../types'
import { axiosInstance } from '../../api/axiosInstance'

type CreateClassDialogProps = {
  onClose: () => void
  onSuccess: () => void
}

export function CreateClassDialog({
  onClose,
  onSuccess,
}: CreateClassDialogProps) {
  const [form, setForm] = useState<CreateClassInput>({
    title: '',
    section: '',
    subject: '',
    semester: '',
    room: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Basic validation
  const validationError = !form.title.trim() ? 'Class name is required' 
                        : !form.section.trim() ? 'Section is required'
                        : !form.subject.trim() ? 'Subject is required' : null

  const canCreate = !validationError && !loading

  const updateField = (field: keyof CreateClassInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    // Clear backend error if user types
    if (error) setError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!canCreate) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.post('/classroom', {
        className: form.title,
        section: form.section,
        subject: form.subject,
        semester: form.semester,
        room: form.room
      })
      
      if (response.data.success) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create classroom. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
      <form
        className="w-full max-w-lg rounded-lg border border-neutral-200 bg-white p-5 shadow-xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-700">New classroom</p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
              Create class
            </h2>
          </div>
          <button
            aria-label="Close create class dialog"
            className="rounded-md border border-neutral-200 p-2 text-zinc-600 hover:bg-neutral-50"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Class name *"
            placeholder="Data Structures"
            value={form.title}
            onChange={(value) => updateField('title', value)}
            disabled={loading}
          />
          <TextField
            label="Section *"
            placeholder="Section A"
            value={form.section}
            onChange={(value) => updateField('section', value)}
            disabled={loading}
          />
          <TextField
            label="Subject *"
            placeholder="Computer Science"
            value={form.subject}
            onChange={(value) => updateField('subject', value)}
            disabled={loading}
          />
          <TextField
            label="Semester"
            placeholder="Semester 3"
            value={form.semester}
            onChange={(value) => updateField('semester', value)}
            disabled={loading}
          />
          <div className="sm:col-span-2">
            <TextField
              label="Room"
              placeholder="AB-204"
              value={form.room}
              onChange={(value) => updateField('room', value)}
              disabled={loading}
            />
          </div>
        </div>
        
        {validationError && form.title && form.section && form.subject ? (
          // Just as a safeguard, shouldn't show if empty initially due to logic above, but useful if they clear a field
          <p className="mt-2 text-xs text-red-500">{validationError}</p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50 disabled:opacity-50"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
            disabled={!canCreate}
            type="submit"
          >
            {loading ? 'Creating...' : 'Create class'}
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
  disabled?: boolean
}

function TextField({ label, onChange, placeholder, value, disabled }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      <input
        className="w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 disabled:bg-neutral-100 disabled:text-neutral-500"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  )
}
