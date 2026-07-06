import { QrCode } from 'lucide-react'
import { DataTable } from '../components/common/DataTable'
import { MockQr } from '../components/common/MockQr'
import { Step } from '../components/common/Step'
import { students } from '../data/mockData'

export function AttendancePage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-700">Live session</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-950">
              Generate attendance QR
            </h2>
          </div>
          <QrCode className="text-teal-700" size={24} />
        </div>

        <div className="my-6 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
          <MockQr />
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Class
            </span>
            <select className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-teal-600">
              <option>CSE-A - Data Structures</option>
              <option>CSE-B - Database Systems</option>
              <option>AIML - Machine Learning Basics</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              Valid network
            </span>
            <input
              className="w-full rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-zinc-600"
              readOnly
              value="IIITN campus network only"
            />
          </label>
          <button
            className="w-full rounded-md bg-teal-600 px-4 py-3 font-semibold text-white hover:bg-teal-700"
            type="button"
          >
            Generate QR
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Attendance flow
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Student scans QR, opens secure link, enters BT ID, and gets marked.
            </p>
          </div>
          <span className="rounded-md bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            58 marked today
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Step number="1" title="Teacher opens session" />
          <Step number="2" title="Students scan QR" />
          <Step number="3" title="BT ID marks attendance" />
        </div>

        <div className="mt-6">
          <DataTable
            title="Latest attendance marks"
            columns={['BT ID', 'Name', 'Class', 'Status', 'Time']}
            rows={students.map((student) => [
              student.id,
              student.name,
              student.className,
              'Marked',
              student.lastLogin,
            ])}
          />
        </div>
      </section>
    </div>
  )
}
