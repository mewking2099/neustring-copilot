import { useNavigate } from 'react-router-dom'

export function DealActionBar() {
  const navigate = useNavigate()

  return (
    <div className="border-t border-[#e4e7ec] px-4 py-3 flex items-center justify-end gap-3 bg-white shrink-0">
      <button
        type="button"
        onClick={() => navigate('/deal/entry')}
        className="border border-[#d0d5dd] rounded px-4 py-2 text-sm text-[#344054] hover:bg-[#f2f4f7] transition-colors"
      >
        CANCEL
      </button>
      <button
        type="button"
        onClick={() => console.log('save')}
        className="border border-[#0e2c46] text-[#0e2c46] rounded px-4 py-2 text-sm hover:bg-[#f2f4f7] transition-colors"
      >
        SAVE
      </button>
      <button
        type="button"
        onClick={() => window.open('/deal-summary.html', '_blank')}
        className="bg-[#82bc34] text-white rounded px-4 py-2 text-sm hover:bg-[#6fa02c] transition-colors font-semibold"
      >
        CREATE DEAL
      </button>
    </div>
  )
}
