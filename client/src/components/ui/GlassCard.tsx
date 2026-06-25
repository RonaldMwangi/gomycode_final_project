import type { ReactNode } from 'react'

export default function GlassCard({
    title,
    children,
    right,
}: {
    title?: string
    children: ReactNode
    right?: ReactNode
}) {
    return (
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
            {title ? (
                <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-white/10">
                    <h3 className="text-lg font-extrabold text-white">{title}</h3>
                    {right}
                </div>
            ) : null}
            <div className={title ? 'p-5' : 'p-5'}>{children}</div>
        </div>
    )
}

