export type StatementFilter = 'all' | 'inbound' | 'outbound'

interface Props {
  direction: StatementFilter
  onChange: (d: StatementFilter) => void
}

const TABS: Array<{ id: StatementFilter; label: string }> = [
  { id: 'all',      label: 'All' },
  { id: 'inbound',  label: 'Inbound' },
  { id: 'outbound', label: 'Outbound' },
]

export function StatementTabs({ direction, onChange }: Props) {
  return (
    <div className="border-b border-[#e4e7ec] flex gap-0">
      {TABS.map((tab) => {
        const active = tab.id === direction
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'px-4 py-2 text-sm font-medium cursor-pointer transition-colors',
              active
                ? 'text-[#0e2c46] border-b-2 border-[#82bc34] -mb-px'
                : 'text-[#667085] hover:text-[#0e2c46]',
            ].join(' ')}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
