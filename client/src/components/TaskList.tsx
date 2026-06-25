import type { Task, TaskStatus } from '../types/api'

function statusMeta(status?: TaskStatus) {
    switch (status) {
        case 'completed':
            return { label: 'Completed', cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' }
        case 'in_progress':
            return { label: 'In progress', cls: 'bg-amber-500/15 border-amber-500/30 text-amber-200' }
        default:
            return { label: 'To do', cls: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-200' }
    }
}

export default function TaskList({
    tasks,
    onUpdate,
    onDelete,
}: {
    tasks: Task[]
    onUpdate: (id: string, payload: Partial<Omit<Task, '_id' | 'userId'>>) => void | Promise<void>
    onDelete: (id: string) => void | Promise<void>
}) {
    return (
        <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-3 bg-white/5 border-b border-white/10">
                <div>
                    <h3 className="text-lg font-extrabold text-white">Your tasks</h3>
                    <p className="text-sm text-white/70">Everything here belongs to you.</p>
                </div>
                <div className="text-sm font-bold text-white/80 bg-white/10 border border-white/10 rounded-full px-3 py-1">
                    {tasks.length} items
                </div>
            </div>

            <div className="divide-y divide-white/10">
                {tasks.length === 0 ? (
                    <div className="p-6 text-center">
                        <div className="text-3xl">✨</div>
                        <p className="mt-2 font-semibold text-white">No tasks yet</p>
                        <p className="text-sm text-white/70">Add one above and start stacking wins.</p>
                    </div>
                ) : (
                    tasks.map((t) => {
                        const meta = statusMeta(t.status)
                        const deadline = t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'

                        return (
                            <div key={t._id} className="p-4 md:p-5">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`text-xs font-black uppercase tracking-wider border rounded-full px-3 py-1 ${meta.cls}`}>
                                                {meta.label}
                                            </span>
                                            {typeof t.priority === 'number' && (
                                                <span className="text-xs font-black uppercase tracking-wider bg-amber-400/10 border border-amber-400/25 text-amber-200 rounded-full px-3 py-1">
                                                    Priority {t.priority}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 text-white font-extrabold break-words">{t.title}</p>
                                        {t.description ? (
                                            <p className="mt-1 text-sm text-white/70 break-words">{t.description}</p>
                                        ) : null}

                                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/70">
                                            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1">Deadline: {deadline}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-stretch gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onUpdate(t._id, { status: t.status === 'completed' ? 'todo' : 'completed' })}
                                            className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 font-extrabold"
                                        >
                                            {t.status === 'completed' ? 'Reopen' : 'Complete'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(t._id)}
                                            className="px-3 py-2 rounded-xl bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/25 text-fuchsia-200 font-extrabold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <select
                                        value={t.status ?? 'todo'}
                                        onChange={(e) => onUpdate(t._id, { status: e.target.value as TaskStatus })}
                                        className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                                    >
                                        <option value="todo">To do</option>
                                        <option value="in_progress">In progress</option>
                                        <option value="completed">Completed</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={t.deadline ? new Date(t.deadline).toISOString().slice(0, 10) : ''}
                                        onChange={(e) => onUpdate(t._id, { deadline: e.target.value || undefined })}
                                        className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
                                    />

                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={typeof t.priority === 'number' ? t.priority : 1}
                                        onChange={(e) => onUpdate(t._id, { priority: Number(e.target.value) })}
                                        className="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
                                    />
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

