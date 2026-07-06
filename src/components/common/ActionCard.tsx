import type { LucideIcon } from 'lucide-react'

type ActionCardProps = {
  icon: LucideIcon
  title: string
  body: string
  onClick: () => void
}

export function ActionCard({ icon: Icon, title, body, onClick }: ActionCardProps) {
  return (
    <button
      className="rounded-lg border border-neutral-200 p-4 text-left hover:border-teal-300 hover:bg-teal-50"
      type="button"
      onClick={onClick}
    >
      <Icon className="text-teal-700" size={22} />
      <h3 className="mt-3 font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{body}</p>
    </button>
  )
}
