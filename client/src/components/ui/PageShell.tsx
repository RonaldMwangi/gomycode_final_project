import type { ReactNode } from 'react'

export default function PageShell({
    children,
}: {
    children: ReactNode
}) {
    return (
        <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_30%_-10%,rgba(217,70,239,0.30),transparent_55%),radial-gradient(900px_circle_at_80%_0%,rgba(245,158,11,0.22),transparent_45%),linear-gradient(180deg,#070914,#050611)]">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">{children}</div>
        </div>
    )
}

