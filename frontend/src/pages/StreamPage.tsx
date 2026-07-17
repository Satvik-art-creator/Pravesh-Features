import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Download,
  FileText,
  FileImage,
  File,
  Loader2,
  Megaphone,
} from 'lucide-react'
import axios from 'axios'

type AttachedFile = {
  originalName: string
  fileType: string
  fileSize: number
  downloadUrl: string
}

type PublicPost = {
  message: string
  teacherName: string
  createdAt: string
  attachedFile?: AttachedFile
}

type ClassroomInfo = {
  className: string
  subject: string
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

function FileIcon({ mimeType, size = 18 }: { mimeType: string; size?: number }) {
  if (mimeType.startsWith('image/')) return <FileImage size={size} />
  if (mimeType === 'application/pdf') return <FileText size={size} />
  return <File size={size} />
}

const iconBg = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'bg-violet-50 text-violet-700'
  if (mimeType === 'application/pdf') return 'bg-red-50 text-red-700'
  return 'bg-blue-50 text-blue-700'
}

export function StreamPage() {
  const { classCode } = useParams<{ classCode: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [classroom, setClassroom] = useState<ClassroomInfo | null>(null)

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

  useEffect(() => {
    const fetchStream = async () => {
      if (!classCode) return
      setLoading(true)
      setError(null)
      try {
        const response = await axios.get(
          `${baseURL}/public/classroom/${classCode.toUpperCase()}/posts`
        )
        if (response.data.success) {
          setPosts(response.data.data)
          setClassroom(response.data.classroom)
        } else {
          setError('Invalid class code — please check the link and try again.')
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Invalid class code — please check the link and try again.')
        } else {
          setError('Could not load class stream. Please try again later.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStream()
  }, [classCode, baseURL])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-zinc-500 font-medium">Loading stream...</p>
        </div>
      </div>
    )
  }

  if (error || !classroom) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-zinc-950">Invalid Link</h2>
          <p className="mt-2 text-sm text-zinc-600">{error || 'Classroom not found.'}</p>
          <p className="mt-1 text-xs text-zinc-400">
            Please ask your teacher for a correct link.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Class Header */}
        <header className="mb-6 text-center pt-6 sm:pt-10">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700">
            <Megaphone className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-teal-600">Class Stream</p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-950">{classroom.className}</h1>
          <p className="mt-1 text-sm text-zinc-500">{classroom.subject}</p>
        </header>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <Megaphone className="mx-auto h-12 w-12 text-zinc-300" />
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">No announcements yet</h3>
            <p className="mt-1 text-sm text-zinc-500">
              No posts have been shared yet for this class.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, idx) => (
              <article
                key={idx}
                className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                    <Megaphone size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-zinc-950">
                        {post.teacherName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(post.createdAt)} · {formatTime(post.createdAt)}
                      </p>
                    </div>

                    {/* Announcement Message */}
                    {post.message && (
                      <p className="text-sm leading-6 text-zinc-700 whitespace-pre-wrap">
                        {post.message}
                      </p>
                    )}

                    {/* Attachment */}
                    {post.attachedFile && (
                      <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 max-w-full">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-md ${iconBg(post.attachedFile.fileType)}`}>
                          <FileIcon mimeType={post.attachedFile.fileType} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-zinc-900">
                            {post.attachedFile.originalName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {formatSize(post.attachedFile.fileSize)}
                          </p>
                        </div>
                        <a
                          href={post.attachedFile.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          download={post.attachedFile.originalName}
                          className="shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-teal-50 hover:text-teal-700 transition"
                          aria-label={`Download ${post.attachedFile.originalName}`}
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-zinc-400 pb-10">
          Shared by your teacher · Pravesh Platform
        </footer>
      </div>
    </div>
  )
}
