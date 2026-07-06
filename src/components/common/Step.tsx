type StepProps = {
  number: string
  title: string
}

export function Step({ number, title }: StepProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
      <div className="flex size-8 items-center justify-center rounded-md bg-teal-600 font-semibold text-white">
        {number}
      </div>
      <p className="mt-3 font-medium text-zinc-950">{title}</p>
    </div>
  )
}
