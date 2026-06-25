import { useState } from 'react'

import type { TaskStatus } from '../types/api'

export default function TaskForm({
    onCreate,
}: {
    onCreate: (payload: {
        title: string
        description?: string
        deadline?: string
        status?: TaskStatus
        priority?: number
    }) => void | Promise<void>
}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [status, setStatus] = useState<TaskStatus>('todo')
    const [priority, setPriority] = useState<number>(1)

    const [busy, setBusy] = useState(false)
    const canSubmit = title.trim().length > 0

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!canSubmit || busy) return
        setBusy(true)

        try {
            await onCreate({
                title: title.trim(),
                description: description.trim() || undefined,
                deadline: deadline || undefined,
                status,
                priority: Number.isFinite(priority) ? priority : undefined,
            })
            setTitle('')
            setDescription('')
            setDeadline('')
            setStatus('todo')
            setPriority(1)
        } finally {
            setBusy(false)
        }
    }

    return (
        <form onSubmit={submit} className="rounded-2xl bg-white/5 border border-white/10 p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-extrabold text-white">Add a task</h3>
                    <p className="text-sm text-white/70">Small steps. Big wins. ✅</p>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/60 bg-white/10 border border-white/10 rounded-full px-3 py-1">
                    Personal
                </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                    <span className="text-xs font-semibold text-white/80">Title</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                        placeholder="e.g. Finish project report"
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-xs font-semibold text-white/80">Deadline</span>
                    <input
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        type="date"
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                    />
                </label>

                <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold text-white/80">Description</span>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 w-full min-h-[92px] rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                        placeholder="Optional details to keep you on track..."
                    />
                </label>

                <label className="block">
                    <span className="text-xs font-semibold text-white/80">Status</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                    >
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </label>

                <label className="block">
                    <span className="text-xs font-semibold text-white/80">Priority</span>
                    <input
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        type="number"
                        min={1}
                        max={10}
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                    />
                </label>
            </div>

            <button
                disabled={!canSubmit || busy}
                className="mt-4 w-full rounded-xl px-4 py-3 font-extrabold text-white bg-gradient-to-r from-fuchsia-500 to-amber-400 hover:from-fuchsia-400 hover:to-amber-300 shadow-lg shadow-fuchsia-500/20 disabled:opacity-60"
            >
                {busy ? 'Adding...' : 'Add task →'}
            </button>
        </form>
    )
}

