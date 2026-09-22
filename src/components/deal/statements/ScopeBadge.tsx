const MAX_VISIBLE = 3

interface Props {
  partners: string[]
}

export function ScopeBadge({ partners }: Props) {
  if (!partners.length) return null

  const visible = partners.slice(0, MAX_VISIBLE)
  const overflow = partners.length - MAX_VISIBLE

  return (
    <span
      title={partners.join(', ')}
      className="inline-flex items-center gap-1 shrink-0 rounded-md bg-[#0e2c46] text-white text-[9px] font-semibold px-2 py-0.5 leading-none"
    >
      {/* Arrow indicating "scoped to" */}
      <svg viewBox="0 0 10 10" className="w-2 h-2 opacity-70" fill="none" aria-hidden="true">
        <path d="M2 5h6M6 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {visible.join(' · ')}
      {overflow > 0 && (
        <span className="opacity-70">+{overflow}</span>
      )}
    </span>
  )
}
