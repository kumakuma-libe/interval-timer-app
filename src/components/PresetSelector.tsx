import type { Preset } from '../types'
import { ChevronDown } from 'lucide-react'

interface Props {
  presets: Preset[]
  activeIndex: number
  onChange: (index: number) => void
}

export function PresetSelector({ presets, activeIndex, onChange }: Props) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="relative">
        <select
          value={activeIndex}
          onChange={e => onChange(Number(e.target.value))}
          className="appearance-none bg-white/20 backdrop-blur text-white pl-4 pr-10 py-2 rounded-lg text-lg font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          {presets.map((p, i) => (
            <option key={i} value={i} className="text-gray-900">
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}
