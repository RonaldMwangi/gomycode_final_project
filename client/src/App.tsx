import { useEffect, useMemo, useState } from 'react'

import AuthPanel from './components/AuthPanel'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

import GlassCard from './components/ui/GlassCard'
import PageShell from './components/ui/PageShell'

import type { AuthResponse, Task, TaskStatus } from './types/api'
import { createTask, deleteTask, listTasks, login, signup, updateTask } from './lib/api'
import { clearSession, getToken, getUser, setSession } from './lib/storage'


function formatGreeting(name?: string) {
  const short = name?.trim() || 'friend'
  return `Hey ${short} — let’s finish something today 💪`
}

export default function App() {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUserState] = useState<AuthResponse['user'] | null>(null)

  const [tasks, setTasks] = useState<Task[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [search, setSearch] = useState('')

  const [busyAction, setBusyAction] = useState<string | null>(null)

  useEffect(() => {
    const t = getToken()
    const u = getUser<AuthResponse['user']>()
    if (t && u) {
      setTokenState(t)
      setUserState(u)
    }
  }, [])

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase()

    return tasks
      .filter((t) => {
        if (statusFilter === 'all') return true
        return (t.status ?? 'todo') === statusFilter
      })
      .filter((t) => {
        if (!q) return true
        return [t.title, t.description].filter(Boolean).join(' ').toLowerCase().includes(q)
      })
      .sort((a, b) => {
        // sort by deadline first (earlier first), then priority desc
        const ad = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY
        const bd = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY
        if (ad !== bd) return ad - bd

        const ap = typeof a.priority === 'number' ? a.priority : 1
        const bp = typeof b.priority === 'number' ? b.priority : 1
        return bp - ap
      })
  }, [tasks, search, statusFilter])

  async function refreshTasks(tkn = token) {
    if (!tkn) return
    setLoadingTasks(true)
    setError(null)
    try {
      const res = await listTasks(tkn)
      setTasks(res.tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoadingTasks(false)
    }
  }

  async function handleAuth(authToken: string, authUser: AuthResponse['user']) {
    setTokenState(authToken)
    setUserState(authUser)
    setSession(authToken, authUser)
    await refreshTasks(authToken)
  }

  async function handleCreate(payload: Parameters<typeof createTask>[1]) {
    if (!token) return
    setBusyAction('create')
    try {
      await createTask(token, payload)
      await refreshTasks()
    } finally {
      setBusyAction(null)
    }
  }

  async function handleUpdate(id: string, payload: Partial<Omit<Task, '_id' | 'userId'>>) {
    if (!token) return
    setBusyAction('update')
    try {
      const normalized: Partial<{
        title: string
        description: string
        deadline: string
        status: TaskStatus
        priority: number
      }> = {}

      if (payload.title !== undefined) normalized.title = payload.title
      if (payload.description !== undefined) normalized.description = payload.description
      if (payload.status !== undefined) normalized.status = payload.status
      if (payload.priority !== undefined) normalized.priority = payload.priority
      if (payload.deadline !== undefined) {
        normalized.deadline =
          payload.deadline instanceof Date ? payload.deadline.toISOString() : payload.deadline
      }

      await updateTask(token, id, normalized)
      await refreshTasks()
    } finally {
      setBusyAction(null)
    }
  }


  async function handleDelete(id: string) {
    if (!token) return
    const ok = window.confirm('Delete this task? This cannot be undone.')
    if (!ok) return

    setBusyAction('delete')
    try {
      await deleteTask(token, id)
      await refreshTasks()
    } finally {
      setBusyAction(null)
    }
  }

  function logout() {
    clearSession()
    setTokenState(null)
    setUserState(null)
    setTasks([])
  }

  if (!token || !user) {
    return (
      <PageShell>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <GlassCard>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs md:text-sm font-black uppercase tracking-widest text-white/60">TaskSprint</p>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-white">
                  A clean way to manage your tasks
                </h1>
                <p className="mt-3 text-sm text-white/75 max-w-xl">
                  Create tasks with deadlines, track progress, and keep everything private per user.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-fuchsia-400 animate-pulse" />
                <div className="text-sm font-bold text-white/70">
                  Backend: <span className="text-amber-200">MongoDB</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-extrabold text-white">✅ Private lists</div>
                <div className="text-sm text-white/70">Each user gets their own tasks.</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-extrabold text-white">📅 Deadlines</div>
                <div className="text-sm text-white/70">Stay on schedule and ahead.</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-extrabold text-white">🎯 Status tracking</div>
                <div className="text-sm text-white/70">Todo → In progress → Done.</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-sm font-extrabold text-white">⚡ Fast UI</div>
                <div className="text-sm text-white/70">Mobile friendly with Tailwind.</div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm text-white/80">
                Tip: sign up, add your first task, and update progress as you go. ✨
              </p>
            </div>
          </GlassCard>

          <GlassCard title="Welcome">
            <AuthPanel onAuth={handleAuth} />
          </GlassCard>
        </div>

        <footer className="mt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} TaskSprint — built for focus.
        </footer>
      </PageShell>
    )
  }


  return (
    <PageShell>
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs md:text-sm font-black uppercase tracking-widest text-white/60">TaskSprint</p>
          <h1 className="mt-1 text-3xl md:text-4xl font-extrabold text-white">{formatGreeting(user.name)}</h1>
          <p className="mt-2 text-white/70">Your tasks are private. You’re in control.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl font-extrabold text-white bg-white/10 border border-white/15 hover:bg-white/15"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Productivity Dashboard (computed from loaded tasks; no backend changes) */}
          <GlassCard title="Productivity">
            {(() => {
              const total = tasks.length
              const completed = tasks.filter((t) => (t.status ?? 'todo') === 'completed').length
              const pending = total - completed
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const overdue = tasks.filter((t) => {
                if ((t.status ?? 'todo') === 'completed') return false
                if (!t.deadline) return false
                const d = new Date(t.deadline)
                d.setHours(0, 0, 0, 0)
                return d.getTime() < today.getTime()
              }).length
              const completionRate = total ? Math.round((completed / total) * 100) : 0

              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs font-bold text-white/60">Total Tasks</div>
                    <div className="mt-1 text-2xl font-extrabold text-white">{total}</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs font-bold text-white/60">Completion Rate</div>
                    <div className="mt-1 text-2xl font-extrabold text-amber-200">{completionRate}%</div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs font-bold text-white/60">Completed</div>
                    <div className="mt-1 text-2xl font-extrabold text-emerald-200">{completed}</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs font-bold text-white/60">Pending</div>
                    <div className="mt-1 text-2xl font-extrabold text-fuchsia-200">{pending}</div>
                  </div>

                  <div className="col-span-2 rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs font-bold text-white/60">Overdue</div>
                    <div className="mt-1 text-2xl font-extrabold text-red-200">{overdue}</div>
                    <div className="mt-2 text-xs text-white/70">
                      Tasks with a past deadline and status not completed.
                    </div>
                  </div>
                </div>
              )
            })()}
          </GlassCard>

          <div className="mt-6" />
          <TaskForm onCreate={handleCreate} />

          <GlassCard title="Filters">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold text-white/60">{filteredTasks.length} shown</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-white/80">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                >
                  <option value="all">All</option>
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-white/80">Search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
                  placeholder="Find by title or description..."
                />
              </label>
            </div>
          </GlassCard>

          {error ? (
            <div className="mt-4 rounded-2xl bg-red-500/15 border border-red-500/30 p-4 text-red-100 font-semibold">
              {error}
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-2">
          {loadingTasks ? (
            <GlassCard>
              <div className="text-white font-extrabold">Loading tasks...</div>
              <div className="mt-2 text-white/70 text-sm">Get ready to win. ⚡</div>
            </GlassCard>
          ) : (
            <TaskList tasks={filteredTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
          )}

          {busyAction ? (
            <div className="mt-4 text-center text-xs font-bold text-white/60">Working: {busyAction}…</div>
          ) : (
            <div className="mt-4 text-center text-xs font-bold text-white/60">Small steps. Big wins. ✅</div>
          )}
        </div>
      </div>
    </PageShell>
  )
}


