const filledCells = new Set([
  0, 1, 2, 3, 5, 6, 7, 8, 10, 13, 15, 16, 18, 20, 21, 22, 24, 27, 28, 30, 31,
  34, 36, 37, 39, 42, 44, 45, 48, 49, 51, 53, 54, 56, 57, 58, 60, 63, 64, 66,
  68, 71, 72, 74, 76, 77, 78, 79, 80,
])

export function MockQr() {
  return (
    <div className="mx-auto grid size-56 grid-cols-9 gap-1 rounded-md bg-white p-3 shadow-sm">
      {Array.from({ length: 81 }).map((_, index) => (
        <span
          key={index}
          className={`rounded-sm ${filledCells.has(index) ? 'bg-zinc-950' : 'bg-white'}`}
        />
      ))}
    </div>
  )
}
