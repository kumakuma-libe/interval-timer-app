import type { Preset } from './types'

export const DEFAULT_PRESETS: Preset[] = [
  {
    name: 'タバタ式',
    prepTime: 10,
    workTime: 20,
    restTime: 10,
    cycles: 8,
    sets: 1,
    setRestTime: 0,
  },
  {
    name: 'HIIT標準',
    prepTime: 10,
    workTime: 45,
    restTime: 15,
    cycles: 10,
    sets: 3,
    setRestTime: 60,
  },
  {
    name: 'ポモドーロ',
    prepTime: 0,
    workTime: 25 * 60,
    restTime: 5 * 60,
    cycles: 4,
    sets: 1,
    setRestTime: 0,
  },
]

const STORAGE_KEY = 'interval-timer-presets'
const ACTIVE_KEY = 'interval-timer-active-preset'

export function loadPresets(): Preset[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return DEFAULT_PRESETS
}

export function savePresets(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export function loadActiveIndex(): number {
  try {
    const idx = localStorage.getItem(ACTIVE_KEY)
    if (idx !== null) return parseInt(idx, 10)
  } catch {}
  return 0
}

export function saveActiveIndex(index: number) {
  localStorage.setItem(ACTIVE_KEY, String(index))
}
