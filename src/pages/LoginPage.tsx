import { CheckCircle2, Database, ShieldCheck } from 'lucide-react'
import { InfoPill } from '../components/common/InfoPill'

type LoginPageProps = {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-neutral-100 px-4 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-neutral-200 bg-white lg:grid-cols-[1fr_440px]">
        <div className="flex flex-col justify-between bg-zinc-950 p-6 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-teal-500 text-lg font-bold text-zinc-950">
              P
            </div>
            <div>
              <p className="text-sm text-teal-200">IIIT Nagpur</p>
              <h1 className="text-2xl font-semibold">Pravesh</h1>
            </div>
          </div>

          <div className="my-12 max-w-xl">
            <p className="mb-3 inline-flex rounded-md bg-white/10 px-3 py-1 text-sm text-teal-100">
              Frontend prototype
            </p>
            <h2 className="text-3xl font-semibold sm:text-5xl">
              College admin system for teachers.
            </h2>
            <p className="mt-5 max-w-lg text-base text-zinc-300">
              Login-only landing screen leading to a professional teacher
              dashboard for student data, attendance QR, notes, assignments,
              and marks export.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
            <InfoPill icon={ShieldCheck} label="IIITN network ready" />
            <InfoPill icon={Database} label="MERN compatible UI" />
            <InfoPill icon={CheckCircle2} label="Responsive pages" />
          </div>
        </div>

        <div className="flex items-center p-6 sm:p-10">
          <form
            className="w-full"
            onSubmit={(event) => {
              event.preventDefault()
              onLogin()
            }}
          >
            <div className="mb-8">
              <p className="text-sm font-medium text-teal-700">Teacher login</p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-950">
                Sign in to dashboard
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Frontend-only demo. Any values will continue to the dashboard.
              </p>
            </div>

            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Teacher email
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                defaultValue="teacher@iiitn.ac.in"
                type="email"
              />
            </label>

            <label className="mb-6 block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                defaultValue="password"
                type="password"
              />
            </label>

            <button
              className="w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
