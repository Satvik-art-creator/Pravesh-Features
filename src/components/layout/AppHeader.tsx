import { LogOut } from 'lucide-react'

type AppHeaderProps = {
  title: string
  onLogout: () => void
}

export function AppHeader({ title, onLogout }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">
              Teacher Portal
            </p>
            <h1 className="text-xl font-semibold text-zinc-950 sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-neutral-50"
            type="button"
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
