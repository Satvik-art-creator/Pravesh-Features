import { LogOut } from 'lucide-react'
import { navItems } from '../../config/navigation'
import type { View } from '../../types'

type SidebarProps = {
  activeView: View
  onChange: (view: View) => void
  onLogout: () => void
}

export function Sidebar({ activeView, onChange, onLogout }: SidebarProps) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-md bg-teal-600 text-lg font-bold text-white">
          P
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-teal-700">Pravesh</p>
          <h2 className="font-semibold text-zinc-950">Teacher Console</h2>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <button
              key={item.id}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${
                isActive
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-zinc-600 hover:bg-neutral-100 hover:text-zinc-950'
              }`}
              type="button"
              onClick={() => onChange(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto rounded-md border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-sm font-semibold text-zinc-950">Prof. Demo User</p>
        <p className="mt-1 text-xs text-zinc-500">CSE Department</p>
        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-neutral-100"
          type="button"
          onClick={onLogout}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  )
}
