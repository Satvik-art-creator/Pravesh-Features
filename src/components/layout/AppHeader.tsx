import { Menu, Search, Settings } from 'lucide-react'

type AppHeaderProps = {
  title: string
  onOpenSidebar: () => void
}

export function AppHeader({ title, onOpenSidebar }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            className="rounded-md border border-neutral-200 p-2 text-zinc-700 lg:hidden"
            type="button"
            onClick={onOpenSidebar}
          >
            <Menu size={20} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">
              Teacher Portal
            </p>
            <h1 className="text-xl font-semibold text-zinc-950 sm:text-2xl">
              {title}
            </h1>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              className="w-72 rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-600 focus:bg-white"
              placeholder="Search classes, students, files"
              type="search"
            />
          </div>
          <button
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-neutral-50"
            type="button"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
