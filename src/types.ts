import type { LucideIcon } from 'lucide-react'

export type View = 'overview' | 'classes' | 'attendance' | 'files' | 'marks'

export type NavItem = {
  id: View
  label: string
  icon: LucideIcon
}

export type ClassSummary = {
  code: string
  title: string
  semester: string
  students: number
  present: number
  submissions: number
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
}

export type MarkRecord = {
  id: string
  name: string
  mid: number
  assignment: number
  final: number
}
