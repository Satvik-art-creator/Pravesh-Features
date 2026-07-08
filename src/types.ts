import type { LucideIcon } from 'lucide-react'

export type View = 'classes'

export type NavItem = {
  id: View
  label: string
  icon: LucideIcon
}

export type ClassSummary = {
  id: string
  code: string
  classCode: string
  title: string
  section: string
  subject: string
  semester: string
  students: number
  present: number
  submissions: number
  room: string
  color: string
}

export type Student = {
  id: string
  name: string
  className: string
  status: string
  attendance: string
  lastLogin: string
}

export type StoredFile = {
  name: string
  type: string
  size: string
  className: string
  uploadedAt: string
}

export type StreamPost = {
  id: string
  className: string
  author: string
  title: string
  body: string
  postedAt: string
  type: 'announcement' | 'material' | 'attendance' | 'assignment'
}

export type ClassworkItem = {
  id: string
  className: string
  title: string
  type: 'Assignment' | 'Material' | 'Quiz'
  topic: string
  createdAt: string
  dueAt?: string
  submissions: number
  totalStudents: number
}

export type AttendanceSession = {
  id: string
  className: string
  lectureDate: string
  startedAt: string
  marked: number
  totalStudents: number
  status: 'Open' | 'Closed'
}

export type MarkRecord = {
  id: string
  name: string
  className: string
  mid: number
  assignment: number
  final: number
}

export type CreateClassInput = {
  title: string
  code: string
  section: string
  subject: string
  semester: string
  room: string
}
