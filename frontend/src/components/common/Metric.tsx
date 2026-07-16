type MetricProps = {
  label: string
  value: string | number
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-md bg-neutral-50 px-2 py-3">
      <p className="text-lg font-semibold text-zinc-950">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  )
}
