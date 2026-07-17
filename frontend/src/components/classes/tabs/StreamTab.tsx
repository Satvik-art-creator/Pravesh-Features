import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Upload,
  Trash2,
  Download,
  FileText,
  FileImage,
  File,
  Loader2,
  Copy,
  Check,
  Link,
  Megaphone,
  X,
  Paperclip,
  Send,
} from 'lucide-react'
import { axiosInstance } from '../../../api/axiosInstance'
import type { ClassSummary } from '../../../types'

// ─── Types ───────────────────────────────────────────────────────────────────

type AttachedFile = {
  originalName: string
  storedName: string
  filePath: string
  fileType: string
  fileSize: number
}

type PostItem = {
  _id: string
  message: string
  attachedFile?: AttachedFile
  teacher: { _id: string; name: string }
  createdAt: string
}

type StreamTabProps = {
  classItem: ClassSummary
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  })

function FileTypeIcon({ mimeType, size = 18 }: { mimeType: string; size?: number }) {
  if (mimeType.startsWith('image/')) return <FileImage size={size} />
  if (mimeType === 'application/pdf') return <FileText size={size} />
  return <File size={size} />
}

const iconBg = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'bg-violet-50 text-violet-700'
  if (mimeType === 'application/pdf') return 'bg-red-50 text-red-700'
  return 'bg-blue-50 text-blue-700'
}

const backendBase = (import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8080/api')
  .replace(/\/api$/, '')

// ─── Component ───────────────────────────────────────────────────────────────

export function StreamTab({ classItem }: StreamTabProps) {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)

  // Create post state
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null)
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Copy link
  const [linkCopied, setLinkCopied] = useState(false)
  const streamLink = `${window.location.origin}/stream/${classItem.classCode}`

  // ── Fetch posts ────────────────────────────────────────────────────────

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get(`/classroom/${classItem.id}/posts`)
      if (res.data.success) setPosts(res.data.data)
    } catch (err) {
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }, [classItem.id])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  // ── Create post ────────────────────────────────────────────────────────

  const canPost = message.trim() || selectedFile

  const handlePost = async () => {
    if (!canPost || posting) return
    setPostError(null)
    setPosting(true)

    const formData = new FormData()
    if (message.trim()) formData.append('message', message.trim())
    if (selectedFile) formData.append('file', selectedFile)

    try {
      await axiosInstance.post(`/classroom/${classItem.id}/posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await fetchPosts()
    } catch (err: any) {
      setPostError(err.response?.data?.message || 'Failed to create post.')
    } finally {
      setPosting(false)
    }
  }

  // ── Delete post ────────────────────────────────────────────────────────

  const handleDelete = async (post: PostItem) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeletingId(post._id)
    try {
      await axiosInstance.delete(`/classroom/${classItem.id}/posts/${post._id}`)
      setPosts((prev) => prev.filter((p) => p._id !== post._id))
    } catch (err) {
      console.error('Error deleting post:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // ── Copy link ──────────────────────────────────────────────────────────

  const handleCopyLink = () => {
    navigator.clipboard.writeText(streamLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2500)
  }

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Shareable public link */}
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link size={16} className="text-teal-700" />
          <p className="text-sm font-semibold text-zinc-950">Share with students</p>
        </div>
        <p className="mb-3 text-xs text-zinc-500">
          Students can view posts and download files without logging in.
        </p>
        <div className="flex items-center gap-2 rounded-md bg-neutral-50 border border-neutral-200 px-3 py-2">
          <span className="flex-1 truncate font-mono text-xs text-teal-800 select-all">
            {streamLink}
          </span>
          <button
            type="button"
            aria-label="Copy stream link"
            onClick={handleCopyLink}
            className="shrink-0 rounded-md border border-neutral-200 bg-white p-1.5 text-zinc-600 hover:bg-neutral-100 transition"
          >
            {linkCopied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
        </div>
      </section>

      {/* Create post */}
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <textarea
          className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100 transition"
          rows={3}
          placeholder="Announce something to your class…"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setPostError(null) }}
          disabled={posting}
        />

        {/* Selected file chip */}
        {selectedFile && (
          <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm text-zinc-700">
            <Paperclip size={14} className="text-zinc-400" />
            <span className="max-w-[200px] truncate">{selectedFile.name}</span>
            <button
              type="button"
              aria-label="Remove file"
              onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="rounded p-0.5 hover:bg-neutral-200 transition"
            >
              <X size={14} className="text-zinc-500" />
            </button>
          </div>
        )}

        {postError && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {postError}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          {/* Attach file */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setSelectedFile(f)
            }}
            disabled={posting}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={posting}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-neutral-100 transition disabled:opacity-50"
          >
            <Upload size={15} />
            Attach file
          </button>

          {/* Submit */}
          <button
            type="button"
            onClick={handlePost}
            disabled={!canPost || posting}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition"
          >
            {posting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Posting…
              </>
            ) : (
              <>
                <Send size={14} />
                Post
              </>
            )}
          </button>
        </div>
      </section>

      {/* Post feed */}
      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 size={20} className="animate-spin text-zinc-400" />
        </div>
      ) : posts.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center">
          <Megaphone className="h-12 w-12 text-zinc-300" />
          <h4 className="mt-3 text-sm font-semibold text-zinc-900">No posts yet</h4>
          <p className="mt-1 text-sm text-zinc-500">
            Share an announcement or upload a resource to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post._id}
              className="rounded-lg border border-neutral-200 bg-white p-5"
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                  <Megaphone size={18} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-zinc-950">
                        {post.teacher?.name || 'Teacher'}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {formatDate(post.createdAt)} · {formatTime(post.createdAt)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      aria-label="Delete post"
                      onClick={() => handleDelete(post)}
                      disabled={deletingId === post._id}
                      className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                    >
                      {deletingId === post._id
                        ? <Loader2 size={15} className="animate-spin" />
                        : <Trash2 size={15} />
                      }
                    </button>
                  </div>

                  {/* Message text */}
                  {post.message && (
                    <p className="mt-3 text-sm leading-6 text-zinc-700 whitespace-pre-wrap">
                      {post.message}
                    </p>
                  )}

                  {/* Attached file chip */}
                  {post.attachedFile && post.attachedFile.storedName && (
                    <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5">
                      <div className={`flex size-9 items-center justify-center rounded-md ${iconBg(post.attachedFile.fileType)}`}>
                        <FileTypeIcon mimeType={post.attachedFile.fileType} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {post.attachedFile.originalName}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatSize(post.attachedFile.fileSize)}
                        </p>
                      </div>
                      <a
                        href={`${backendBase}/uploads/${post.attachedFile.storedName}`}
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
    </div>
  )
}
