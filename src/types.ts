export interface Preset {
  name: string
  prepTime: number      // seconds
  workTime: number      // seconds
  restTime: number      // seconds
  cycles: number
  sets: number
  setRestTime: number   // seconds
}

export type TimerState = 'idle' | 'running' | 'paused'
export type Phase = 'prep' | 'work' | 'rest' | 'setRest' | 'finished'

export interface TimerStatus {
  timerState: TimerState
  currentPhase: Phase
  timeLeft: number
  currentCycle: number
  currentSet: number
}
