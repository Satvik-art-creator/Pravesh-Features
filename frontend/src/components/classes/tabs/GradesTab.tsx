import { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowDownToLine,
  Loader2,
  ClipboardList,
  X,
  Check,
} from 'lucide-react'
import { axiosInstance } from '../../../api/axiosInstance'
import type { ClassSummary } from '../../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

type ExamSummary = {
  _id: string
  examName: string
  maxMarks: number
  studentsCount: number
  createdAt: string
}

type GradeRecord = {
  btechId: string
  name: string
  marksObtained: number | null
}

type ExamDetail = {
  _id: string
  examName: string
  maxMarks: number
  records: GradeRecord[]
  createdAt: string
}

// Local editable row — tracks input string so the user can type freely
type EditableRow = {
  btechId: string
  name: string
  value: string    // raw string in the input
  error: boolean
}

// ─── Props ───────────────────────────────────────────────────────────────────

type GradesTabProps = {
  classItem: ClassSummary
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

// ─── Create Exam Modal ────────────────────────────────────────────────────────

type CreateExamModalProps = {
  classroomId: string
  onClose: () => void
  onCreated: () => void
}

function CreateExamModal({ classroomId, onClose, onCreated }: CreateExamModalProps) {
  const [examName, setExamName] = useState('')
  const [maxMarks, setMaxMarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!examName.trim()) {
      setError('Exam name is required')
      return
    }
    const maxMarksNum = Number(maxMarks)
    if (!maxMarks || isNaN(maxMarksNum) || maxMarksNum <= 0) {
      setError('Max marks must be a positive number')
      return
    }

    setLoading(true)
    try {
      await axiosInstance.post(`/grades/${classroomId}/exam`, {
        examName: examName.trim(),
        maxMarks: maxMarksNum,
      })
      onCreated()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create exam. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h3 className="text-base font-semibold text-zinc-950">Add New Exam</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 hover:bg-neutral-100 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Exam Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mid Sem 1"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition"
              disabled={loading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Max Marks
            </label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={maxMarks}
              min={1}
              onChange={(e) => setMaxMarks(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 transition"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-neutral-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Exam'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Exam List View ───────────────────────────────────────────────────────────

type ExamListViewProps = {
  classroomId: string
  onSelectExam: (exam: ExamSummary) => void
}

function ExamListView({ classroomId, onSelectExam }: ExamListViewProps) {
  const [exams, setExams] = useState<ExamSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchExams = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/grades/${classroomId}`)
      if (res.data.success) setExams(res.data.data)
    } catch (err) {
      console.error('Error fetching exams:', err)
    } finally {
      setLoading(false)
    }
  }, [classroomId])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  const handleDelete = async (exam: ExamSummary) => {
    const confirmed = window.confirm(
      `Delete "${exam.examName}"? This cannot be undone.`
    )
    if (!confirmed) return
    setDeletingId(exam._id)
    try {
      await axiosInstance.delete(`/grades/${classroomId}/exam/${exam._id}`)
      setExams((prev) => prev.filter((e) => e._id !== exam._id))
    } catch (err) {
      console.error('Error deleting exam:', err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {showModal && (
        <CreateExamModal
          classroomId={classroomId}
          onClose={() => setShowModal(false)}
          onCreated={fetchExams}
        />
      )}

      <div className="space-y-5">
        {/* Header */}
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-teal-700">Grades</p>
              <h3 className="mt-1 text-xl font-semibold text-zinc-950">
                Exam grade sheets
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Create exams, enter marks per student, and export CSV.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
            >
              <Plus size={16} />
              Add Exam
            </button>
          </div>
        </section>

        {/* Exam list */}
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 size={20} className="animate-spin text-zinc-400" />
            </div>
          ) : exams.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
              <ClipboardList className="h-12 w-12 text-zinc-300" />
              <h4 className="mt-3 text-sm font-semibold text-zinc-900">No exams yet</h4>
              <p className="mt-1 text-sm text-zinc-500">
                Click "+ Add Exam" to create your first grade sheet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-neutral-50 text-xs uppercase text-zinc-500">
                  <tr>
                    {['Exam Name', 'Max Marks', 'Students', 'Created On', ''].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {exams.map((exam) => (
                    <tr
                      key={exam._id}
                      className="hover:bg-neutral-50 transition cursor-pointer"
                      onClick={() => onSelectExam(exam)}
                    >
                      <td className="px-4 py-3 font-medium text-zinc-950">
                        {exam.examName}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{exam.maxMarks}</td>
                      <td className="px-4 py-3 text-zinc-700">{exam.studentsCount}</td>
                      <td className="px-4 py-3 text-zinc-500">{formatDate(exam.createdAt)}</td>
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label={`Delete ${exam.examName}`}
                          onClick={() => handleDelete(exam)}
                          disabled={deletingId === exam._id}
                          className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                        >
                          {deletingId === exam._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── Exam Detail / Marks Entry View ──────────────────────────────────────────

type ExamDetailViewProps = {
  classroomId: string
  examSummary: ExamSummary
  onBack: () => void
}

function ExamDetailView({ classroomId, examSummary, onBack }: ExamDetailViewProps) {
  const [exam, setExam] = useState<ExamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<EditableRow[]>([])
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [exportLoading, setExportLoading] = useState(false)

  // Load detail on mount
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get(
          `/grades/${classroomId}/exam/${examSummary._id}`
        )
        if (res.data.success) {
          const data: ExamDetail = res.data.data
          setExam(data)
          setRows(
            data.records.map((r) => ({
              btechId: r.btechId,
              name: r.name,
              value: r.marksObtained !== null && r.marksObtained !== undefined
                ? String(r.marksObtained)
                : '',
              error: false,
            }))
          )
        }
      } catch (err) {
        console.error('Error fetching exam detail:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [classroomId, examSummary._id])

  const handleRowChange = (index: number, raw: string) => {
    setSaveStatus('idle')
    setRows((prev) => {
      const updated = [...prev]
      const val = raw.trim()
      let hasError = false
      if (val !== '') {
        const num = Number(val)
        if (isNaN(num) || num < 0 || num > (exam?.maxMarks ?? Infinity)) {
          hasError = true
        }
      }
      updated[index] = { ...updated[index], value: raw, error: hasError }
      return updated
    })
  }

  const hasErrors = rows.some((r) => r.error)

  const handleSave = async () => {
    if (!exam || hasErrors) return
    setSaving(true)
    setSaveStatus('idle')
    try {
      const payload = rows.map((r) => ({
        btechId: r.btechId,
        marksObtained: r.value.trim() === '' ? null : Number(r.value)
      }))
      await axiosInstance.put(`/grades/${classroomId}/exam/${exam._id}`, {
        records: payload
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (err) {
      console.error('Error saving marks:', err)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const handleExportCsv = async () => {
    if (!exam) return
    setExportLoading(true)
    try {
      const res = await axiosInstance.get(
        `/grades/${classroomId}/exam/${exam._id}/export`,
        { responseType: 'blob' }
      )
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${exam.examName}-grades.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting CSV:', err)
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        Failed to load exam details. Please go back and try again.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition"
            >
              <ArrowLeft size={15} />
              Back to exams
            </button>
            <p className="text-sm font-medium text-teal-700">Grade Sheet</p>
            <h3 className="mt-0.5 text-xl font-semibold text-zinc-950">{exam.examName}</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Max marks: <span className="font-medium text-zinc-700">{exam.maxMarks}</span>
              &ensp;·&ensp;{rows.length} student{rows.length !== 1 ? 's' : ''}
              &ensp;·&ensp;Created {formatDate(exam.createdAt)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Save status indicator */}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check size={15} />
                Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-sm font-medium text-red-600">Save failed</span>
            )}

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exportLoading}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-neutral-50 disabled:opacity-50 transition"
            >
              {exportLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowDownToLine size={14} />
              )}
              Export CSV
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || hasErrors}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Marks'
              )}
            </button>
          </div>
        </div>

        {hasErrors && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            One or more marks are out of range (0 – {exam.maxMarks}). Fix them before saving.
          </div>
        )}
      </section>

      {/* Marks table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {rows.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
            <p className="text-sm text-zinc-500">
              No students were enrolled in this class when the exam was created.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">BT ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">
                    Marks Obtained{' '}
                    <span className="normal-case font-normal text-zinc-400">
                      (out of {exam.maxMarks})
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {rows.map((row, i) => (
                  <tr key={row.btechId}>
                    <td className="px-4 py-2.5 font-medium text-zinc-950">{row.btechId}</td>
                    <td className="px-4 py-2.5 text-zinc-700">{row.name}</td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={0}
                        max={exam.maxMarks}
                        value={row.value}
                        placeholder="—"
                        onChange={(e) => handleRowChange(i, e.target.value)}
                        className={`w-24 rounded-md border px-2.5 py-1.5 text-sm outline-none focus:ring-4 transition ${
                          row.error
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-100'
                            : 'border-neutral-300 focus:border-teal-600 focus:ring-teal-100'
                        }`}
                      />
                      {row.error && (
                        <p className="mt-0.5 text-xs text-red-500">
                          Must be 0 – {exam.maxMarks}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main GradesTab component ─────────────────────────────────────────────────

export function GradesTab({ classItem }: GradesTabProps) {
  const [selectedExam, setSelectedExam] = useState<ExamSummary | null>(null)

  return selectedExam ? (
    <ExamDetailView
      classroomId={classItem.id}
      examSummary={selectedExam}
      onBack={() => setSelectedExam(null)}
    />
  ) : (
    <ExamListView
      classroomId={classItem.id}
      onSelectExam={setSelectedExam}
    />
  )
}
