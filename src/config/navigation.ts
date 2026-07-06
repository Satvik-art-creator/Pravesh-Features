import {
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  QrCode,
  Users,
} from 'lucide-react'
import type { NavItem } from '../types'

export const navItems: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'classes', label: 'Class Data', icon: Users },
  { id: 'attendance', label: 'Attendance', icon: QrCode },
  { id: 'files', label: 'File Storage', icon: FolderOpen },
  { id: 'marks', label: 'Marks', icon: ClipboardList },
]
