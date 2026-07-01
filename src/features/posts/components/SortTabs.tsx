import type { SortOption } from '../types'

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'hot', label: 'Hot' },
  { value: 'new', label: 'New' },
  { value: 'top', label: 'Top' },
]

interface Props {
  value: SortOption
  onChange: (sort: SortOption) => void
}

export function SortTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-full border border-zinc-200 bg-white p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={
            'rounded-full px-4 py-1 text-sm font-medium transition ' +
            (value === opt.value
              ? 'bg-orange-600 text-white'
              : 'text-zinc-600 hover:bg-zinc-100')
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
