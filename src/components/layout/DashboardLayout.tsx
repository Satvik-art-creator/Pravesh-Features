import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { navItems } from '../../config/navigation'
import type { View } from '../../types'
import { AppHeader } from './AppHeader'
import { Sidebar } from './Sidebar'

type DashboardLayoutProps = {
  activeView: View
  children: ReactNode
  onLogout: () => void
  onViewChange: (view: View) => void
}

export function DashboardLayout({
  activeView,
  children,
  onLogout,
  onViewChange,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeLabel = useMemo(
    () => navItems.find((item) => item.id === activeView)?.label ?? 'Dashboard',
    [activeView],
  )

  const handleViewChange = (view: View) => {
    onViewChange(view)
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-zinc-950">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          activeView={activeView}
          onChange={handleViewChange}
          onLogout={onLogout}
        />
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-zinc-950/30 lg:hidden"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <AppHeader
          title={activeLabel}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
