import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react'
import { InfoPill } from '../components/common/InfoPill'
import { useAuth } from '../context/AuthContext'
import { axiosInstance } from '../api/axiosInstance'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await axiosInstance.post('/auth/login', { email, password })
      if (response.data.success) {
        login(response.data.data.token, response.data.data.teacher)
        navigate('/')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-8">
              <p className="text-sm font-medium text-teal-700">Teacher login</p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-950">
                Sign in to dashboard
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Enter your credentials to access the teacher dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Teacher email
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                type="email"
                placeholder="teacher@iiitn.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="mb-6 block">
              <span className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </span>
              <input
                className="w-full rounded-md border border-neutral-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              className="w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
