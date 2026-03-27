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
  prep: '🏃 準備中',
  work: '🔥 ワークアウト',
  rest: '😌 休憩',
  setRest: '☕ セット間休憩',
  finished: '🎉 完了！',
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
    <div className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-500 ${bgColor} text-white p-4 font-sans`}>
      {/* Phase label */}
      <p className="text-3xl sm:text-4xl font-bold mb-3 tracking-wide">
        {PHASE_LABELS[currentPhase]}
      </p>

      {/* Time display */}
      <p className="text-[6rem] sm:text-[8rem] font-display font-black tabular-nums leading-none mb-4 drop-shadow-lg">
        {currentPhase === 'finished' ? '00:00' : formatTime(timeLeft)}
      </p>

      {/* Progress */}
      <div className="flex gap-4 sm:gap-6 text-lg sm:text-2xl font-bold mb-8 sm:mb-10 opacity-90">
        <span className="bg-white/15 px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap">
          サイクル {currentCycle}/{totalCycles}
        </span>
        <span className="bg-white/15 px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap">
          セット {currentSet}/{totalSets}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur px-5 sm:px-8 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg whitespace-nowrap"
        >
          {timerState === 'running' ? (
            <><Pause size={24} /> 一時停止</>
          ) : (
            <><Play size={24} /> スタート</>
          )}
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur px-5 sm:px-8 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg whitespace-nowrap"
        >
          <RotateCcw size={24} /> リセット
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 backdrop-blur px-4 sm:px-5 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold transition-all shadow-lg"
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  )
}
