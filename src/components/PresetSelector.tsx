import type { Preset } from '../types'
import { ChevronDown } from 'lucide-react'

interface Props {
  presets: Preset[]
  activeIndex: number
  onChange: (index: number) => void
}

export function PresetSelector({ presets, activeIndex, onChange }: Props) {
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
      <div className="relative">
        <select
          value={activeIndex}
          onChange={e => onChange(Number(e.target.value))}
          className="appearance-none bg-white/20 backdrop-blur text-white pl-5 pr-12 py-2.5 rounded-full text-xl font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
        >
          {presets.map((p, i) => (
            <option key={i} value={i} className="text-gray-900">
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown size={22} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}
