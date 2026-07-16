import {
  CalendarDays,
  ClipboardList,
  Megaphone,
  MessageSquareText,
  Plus,
  QrCode,
} from 'lucide-react'
import { classworkItems, streamPosts } from '../../../data/mockData'
import type { ClassSummary, StreamPost } from '../../../types'

type StreamTabProps = {
  classItem: ClassSummary
}

const postIcons: Record<StreamPost['type'], typeof Megaphone> = {
  announcement: Megaphone,
  material: MessageSquareText,
  attendance: QrCode,
  assignment: ClipboardList,
}

export function StreamTab({ classItem }: StreamTabProps) {
  const posts = streamPosts.filter((post) => post.className === classItem.code)
  const upcomingItems = classworkItems
    .filter((item) => item.className === classItem.code && item.type !== 'Material')
    .slice(0, 3)

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
      <section className="space-y-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <button
            className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm text-zinc-500 hover:border-teal-300 hover:bg-white"
            type="button"
          >
            <Plus className="text-teal-700" size={18} />
            Announce something to your class
          </button>
        </div>

        {posts.map((post) => {
          const Icon = postIcons[post.type]

          return (
            <article
              key={post.id}
              className="rounded-lg border border-neutral-200 bg-white p-5"
            >
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-950">
                    {post.author}
                  </p>
                  <p className="text-xs text-zinc-500">{post.postedAt}</p>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-950">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {post.body}
                  </p>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <aside className="space-y-4">
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-teal-700">
            <CalendarDays size={18} />
            <p className="text-sm font-semibold">Upcoming</p>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingItems.map((item) => (
              <div key={item.id} className="rounded-md bg-neutral-50 p-3">
                <p className="text-sm font-semibold text-zinc-950">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {item.dueAt ? `Due ${item.dueAt}` : `Posted ${item.createdAt}`}
                </p>
              </div>
            ))}
            {upcomingItems.length === 0 && (
              <p className="text-sm text-zinc-500">No upcoming work.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm font-semibold text-zinc-950">Class code</p>
          <p className="mt-2 rounded-md bg-neutral-50 px-3 py-2 font-mono text-lg font-semibold text-teal-700">
            {classItem.classCode}
          </p>
          <button
            className="mt-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-neutral-50"
            type="button"
          >
            Copy class code
          </button>
        </section>
      </aside>
    </div>
  )
}
