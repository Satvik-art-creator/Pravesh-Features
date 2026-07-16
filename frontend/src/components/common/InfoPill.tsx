import type { LucideIcon } from 'lucide-react'

type InfoPillProps = {
  icon: LucideIcon
  label: string
}

export function InfoPill({ icon: Icon, label }: InfoPillProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-2">
      <Icon size={16} />
      <span>{label}</span>
    </div>
  )
}
