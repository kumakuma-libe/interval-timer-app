import type { Phase, TimerState } from '../types'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'

interface Props {
  timerState: TimerState
  currentPhase: Phase
  timeLeft: number
  currentCycle: number
  totalCycles: number
  currentSet: number
  totalSets: number
  onToggle: () => void
  onReset: () => void
  onOpenSettings: () => void
}

const PHASE_LABELS: Record<Phase, string> = {
  prep: '準備中',
  work: 'ワークアウト',
  rest: '休憩',
  setRest: 'セット間休憩',
  finished: '完了！',
}

const PHASE_BG: Record<Phase, string> = {
  prep: 'bg-blue-500',
  work: 'bg-red-500',
  rest: 'bg-green-500',
  setRest: 'bg-teal-500',
  finished: 'bg-gray-700',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerDisplay({
  timerState,
  currentPhase,
  timeLeft,
  currentCycle,
  totalCycles,
  currentSet,
  totalSets,
  onToggle,
  onReset,
  onOpenSettings,
}: Props) {
  const bgColor = timerState === 'idle' && currentPhase !== 'finished'
    ? 'bg-gray-800'
    : PHASE_BG[currentPhase]

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${bgColor} text-white p-4`}>
      {/* Phase label */}
      <p className="text-2xl font-semibold mb-2 tracking-wide">
        {PHASE_LABELS[currentPhase]}
      </p>

      {/* Time display */}
      <p className="text-8xl font-mono font-bold tabular-nums mb-6">
        {currentPhase === 'finished' ? '00:00' : formatTime(timeLeft)}
      </p>

      {/* Progress */}
      <div className="flex gap-8 text-lg mb-8">
        <span>サイクル: {currentCycle} / {totalCycles}</span>
        <span>セット: {currentSet} / {totalSets}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-xl text-lg font-medium transition-colors"
        >
          {timerState === 'running' ? (
            <><Pause size={24} /> 一時停止</>
          ) : (
            <><Play size={24} /> スタート</>
          )}
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-6 py-3 rounded-xl text-lg font-medium transition-colors"
        >
          <RotateCcw size={24} /> リセット
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-3 rounded-xl text-lg font-medium transition-colors"
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  )
}
