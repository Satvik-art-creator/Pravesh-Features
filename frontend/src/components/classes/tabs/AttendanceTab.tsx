import { useState, useEffect, useRef, useCallback } from 'react'
import { CalendarDays, QrCode, Copy, Check, Loader2, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Step } from '../../common/Step'
import { axiosInstance } from '../../../api/axiosInstance'
import type { ClassSummary } from '../../../types'

type AttendanceTabProps = {
  classItem: ClassSummary
}

type SessionData = {
  sessionId: string
  expiresAt: string
  joinUrl: string
}

type HistorySession = {
  sessionId: string
  date: string
  presentCount: number
}

type SessionRecord = {
  name: string
  btechId: string
  timestamp: string
  wifiVerified: boolean
}

type SessionDetail = {
  sessionId: string
  date: string
  records: SessionRecord[]
}

export function AttendanceTab({ classItem }: AttendanceTabProps) {
  // QR generation state
  const [generating, setGenerating] = useState(false)
  const [session, setSession] = useState<SessionData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // History state
  const [history, setHistory] = useState<HistorySession[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (!session) return

    const updateCountdown = () => {
      const remaining = Math.max(0, new Date(session.expiresAt).getTime() - Date.now())
      setTimeRemaining(remaining)
      if (remaining === 0 && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    updateCountdown()
    timerRef.current = setInterval(updateCountdown, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [session])

  // Load history on mount
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const response = await axiosInstance.get(`/attendance/${classItem.id}`)
      if (response.data.success) {
        setHistory(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching attendance history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }, [classItem.id])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const response = await axiosInstance.post(`/attendance/${classItem.id}/generate`)
      if (response.data.success) {
        setSession(response.data.data)
        // Refresh history after generating
        fetchHistory()
      }
    } catch (err: any) {
      console.error('Error generating session:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (!session) return
    navigator.clipboard.writeText(session.joinUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleDetail = async (sessionId: string) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null)
      setSessionDetail(null)
      return
    }

    setExpandedSessionId(sessionId)
    setDetailLoading(true)
    try {
      const response = await axiosInstance.get(`/attendance/${classItem.id}/session/${sessionId}`)
      if (response.data.success) {
        setSessionDetail(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching session detail:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }


  const isExpired = session && timeRemaining === 0

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      {/* Left column — QR generation */}
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Live session</p>
            <h3 className="mt-1 text-xl font-semibold text-zinc-950">
              Generate attendance QR
            </h3>
          </div>
          <QrCode className="text-teal-700" size={24} />
        </div>

        {/* Active QR display */}
        {session && !isExpired ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 flex items-center justify-center">
              <QRCodeSVG
                value={session.joinUrl}
                size={220}
                bgColor="transparent"
                fgColor="#09090b"
                level="M"
              />
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 rounded-md bg-teal-50 px-3 py-2 border border-teal-100">
              <Clock size={16} className="text-teal-700" />
              <span className="text-sm font-semibold text-teal-800">
                Expires in {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Copyable link */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-500">Share this link as a fallback:</p>
              <div className="flex items-center gap-2 rounded-md bg-neutral-50 border border-neutral-200 px-3 py-2">
                <span className="font-mono text-xs text-teal-800 break-all flex-1 select-all">
                  {session.joinUrl}
                </span>
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-neutral-200 bg-white p-1.5 text-zinc-600 hover:bg-neutral-100 transition"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Expired state */}
            {isExpired && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 text-center">
                Session expired — generate a new one
              </div>
            )}

            {/* Steps */}
            <div className="space-y-3">
              <Step number="1" title="Teacher opens class session" />
              <Step number="2" title="Students scan class QR" />
              <Step number="3" title="BT ID marks attendance" />
            </div>

            <div className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-zinc-600">
              Works only on IIITN campus network. Session expires after the configured time window.
            </div>

            <button
              className="w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 transition disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="button"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR for this class'
              )}
            </button>
          </div>
        )}
      </section>

      {/* Right column — Attendance history */}
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-2 text-teal-700">
          <CalendarDays size={18} />
          <h3 className="text-lg font-semibold text-zinc-950">
            Attendance sessions
          </h3>
        </div>

        {historyLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-zinc-500">Loading sessions...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white p-8 text-center">
            <QrCode className="mx-auto h-12 w-12 text-zinc-400" />
            <h4 className="mt-2 text-sm font-semibold text-zinc-900">No attendance sessions yet</h4>
            <p className="mt-1 text-sm text-zinc-500">
              Generate a QR to start taking attendance.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <div key={entry.sessionId} className="rounded-lg border border-neutral-200 overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-neutral-50 transition"
                  onClick={() => handleToggleDetail(entry.sessionId)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                      <CalendarDays size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-950 truncate">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(entry.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {entry.presentCount} present
                    </span>
                    {expandedSessionId === entry.sessionId ? (
                      <ChevronUp size={16} className="text-zinc-400" />
                    ) : (
                      <ChevronDown size={16} className="text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {expandedSessionId === entry.sessionId && (
                  <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
                    {detailLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 size={16} className="animate-spin text-zinc-400" />
                        <span className="ml-2 text-sm text-zinc-500">Loading records...</span>
                      </div>
                    ) : sessionDetail && sessionDetail.records.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="text-xs uppercase text-zinc-500">
                            <tr>
                              <th className="px-3 py-2 font-semibold">BT ID</th>
                              <th className="px-3 py-2 font-semibold">Name</th>
                              <th className="px-3 py-2 font-semibold">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200">
                            {sessionDetail.records.map((record) => (
                              <tr key={record.btechId}>
                                <td className="px-3 py-2 font-medium text-zinc-950">{record.btechId}</td>
                                <td className="px-3 py-2 text-zinc-600">{record.name}</td>
                                <td className="px-3 py-2 text-zinc-600">
                                  {new Date(record.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="py-2 text-sm text-zinc-500 text-center">No attendance records for this session.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
