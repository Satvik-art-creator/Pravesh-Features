import type { ReactNode } from 'react'
import type { View } from '../../types'
import { AppHeader } from './AppHeader'

type DashboardLayoutProps = {
  activeView: View
  children: ReactNode
  onLogout: () => void
  title: string
  onViewChange: (view: View) => void
}

export function DashboardLayout({
  children,
  onLogout,
  title,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100 text-zinc-950">
      <div>
        <AppHeader
          title={title}
          onLogout={onLogout}
        />
        <main className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}
