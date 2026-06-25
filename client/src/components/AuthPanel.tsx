import { useState } from 'react'

import { login, signup } from '../lib/api'

export default function AuthPanel({
    onAuth,
}: {
    onAuth: (token: string, user: { id: string; name?: string; email: string }) => void
}) {
    const [mode, setMode] = useState<'signup' | 'login'>('signup')
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setBusy(true)

        try {
            if (mode === 'signup') {
                const res = await signup({ name: name.trim() || undefined, email, password })
                onAuth(res.token, res.user)
            } else {
                const res = await login({ email, password })
                onAuth(res.token, res.user)
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Auth failed'
            setError(message)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-xl font-extrabold text-white">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
                    <p className="text-sm text-white/70">Login to access <span className="font-extrabold text-amber-200">your private task board</span>.</p>
                </div>


                <div className="bg-white/10 border border-white/15 rounded-xl p-1 flex">
                    <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${mode === 'signup' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
                    >
                        Sign up
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
                    >
                        Log in
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="bg-white/10 border border-white/15 rounded-2xl p-4 md:p-6">
                {mode === 'signup' && (
                    <label className="block mb-3">
                        <span className="text-sm font-semibold text-white/80">Name</span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                            placeholder="Alex"
                            autoComplete="name"
                        />
                    </label>
                )}

                <label className="block mb-3">
                    <span className="text-sm font-semibold text-white/80">Email</span>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                        placeholder="alex@example.com"
                        autoComplete="email"
                        type="email"
                        required
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-sm font-semibold text-white/80">Password</span>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded-xl px-3 py-2 bg-white/10 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                        placeholder="••••••••"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        type="password"
                        required
                        minLength={6}
                    />
                </label>

                {error && <div className="text-red-200 bg-red-500/15 border border-red-500/30 rounded-xl p-3 text-sm mb-4">{error}</div>}

                <button
                    disabled={busy}
                    className="w-full rounded-xl px-4 py-3 font-extrabold text-white bg-gradient-to-r from-fuchsia-500 to-amber-400 hover:from-fuchsia-400 hover:to-amber-300 shadow-lg shadow-fuchsia-500/20 disabled:opacity-60"
                >
                    {busy ? 'Working...' : mode === 'signup' ? 'Create account & start' : 'Log in & jump in'}
                </button>

                <p className="mt-3 text-xs text-white/60">Tip: Use your token to access tasks—everything is private to your account.</p>
            </form>
        </div>
    )
}

