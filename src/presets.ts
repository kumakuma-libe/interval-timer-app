import type { Preset } from './types'

export const DEFAULT_PRESETS: Preset[] = [
  {
    name: 'プリセット 1',
    prepTime: 0,
    workTime: 0,
    restTime: 0,
    cycles: 0,
    sets: 0,
    setRestTime: 0,
  },
  {
    name: 'プリセット 2',
    prepTime: 0,
    workTime: 0,
    restTime: 0,
    cycles: 0,
    sets: 0,
    setRestTime: 0,
  },
  {
    name: 'プリセット 3',
    prepTime: 0,
    workTime: 0,
    restTime: 0,
    cycles: 0,
    sets: 0,
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
