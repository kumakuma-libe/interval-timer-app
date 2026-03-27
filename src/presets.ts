import type { Preset } from './types'

export const DEFAULT_PRESETS: Preset[] = [
  {
    name: '筋トレ基本',
    prepTime: 10,
    workTime: 30,
    restTime: 15,
    cycles: 7,
    sets: 1,
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

// URLからプリセットを復元する
function loadPresetsFromURL(): Preset[] | null {
  try {
    const hash = window.location.hash
    if (hash && hash.startsWith('#presets=')) {
      const encoded = hash.slice('#presets='.length)
      const json = decodeURIComponent(atob(encoded))
      const parsed = JSON.parse(json)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // URLから読み込んだらlocalStorageにも保存
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
        // ハッシュをクリア（URLを綺麗に）
        history.replaceState(null, '', window.location.pathname + window.location.search)
        return parsed
      }
    }
  } catch {}
  return null
}

export function loadPresets(): Preset[] {
  // 1. URLから復元を試みる
  const fromURL = loadPresetsFromURL()
  if (fromURL) return fromURL

  // 2. localStorageから読み込む
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}

  // 3. デフォルト値を返す
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

// 現在の設定をURLとして生成する
export function generateShareURL(presets: Preset[]): string {
  const json = JSON.stringify(presets)
  const encoded = btoa(encodeURIComponent(json))
  const base = window.location.origin + window.location.pathname
  return `${base}#presets=${encoded}`
}
