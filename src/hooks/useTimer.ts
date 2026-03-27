import { useState, useRef, useCallback, useEffect } from 'react'
import type { Preset, TimerState, Phase } from '../types'
import { playCountdownBeep, playStartBeep, playFinishBeep, unlockAudio } from './useAudio'

export function useTimer(preset: Preset) {
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [currentPhase, setCurrentPhase] = useState<Phase>('prep')
  const [timeLeft, setTimeLeft] = useState(preset.prepTime || preset.workTime)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [currentSet, setCurrentSet] = useState(1)

  const intervalRef = useRef<number | null>(null)
  const stateRef = useRef({ currentPhase, timeLeft, currentCycle, currentSet, preset })

  useEffect(() => {
    stateRef.current = { currentPhase, timeLeft, currentCycle, currentSet, preset }
  })

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setTimerState('idle')
    setCurrentPhase('prep')
    setTimeLeft(preset.prepTime || preset.workTime)
    setCurrentCycle(1)
    setCurrentSet(1)
  }, [clearTimer, preset])

  // Reset when preset changes
  useEffect(() => {
    reset()
  }, [preset, reset])

  const advancePhase = useCallback(() => {
    const s = stateRef.current
    const p = s.preset

    if (s.currentPhase === 'prep') {
      playStartBeep()
      setCurrentPhase('work')
      setTimeLeft(p.workTime)
      return
    }

    if (s.currentPhase === 'work') {
      // Check if this is the last cycle of the last set
      if (s.currentCycle >= p.cycles && s.currentSet >= p.sets) {
        playFinishBeep()
        setCurrentPhase('finished')
        setTimerState('idle')
        clearTimer()
        return
      }

      // If not last cycle in this set, go to rest
      if (s.currentCycle < p.cycles) {
        playStartBeep()
        setCurrentPhase('rest')
        setTimeLeft(p.restTime)
        return
      }

      // Last cycle of current set but not last set -> setRest
      if (s.currentSet < p.sets) {
        if (p.setRestTime > 0) {
          playStartBeep()
          setCurrentPhase('setRest')
          setTimeLeft(p.setRestTime)
        } else {
          // No set rest, go directly to next set
          playStartBeep()
          setCurrentPhase('work')
          setTimeLeft(p.workTime)
          setCurrentCycle(1)
          setCurrentSet(s.currentSet + 1)
        }
        return
      }
    }

    if (s.currentPhase === 'rest') {
      playStartBeep()
      setCurrentPhase('work')
      setTimeLeft(p.workTime)
      setCurrentCycle(s.currentCycle + 1)
      return
    }

    if (s.currentPhase === 'setRest') {
      playStartBeep()
      setCurrentPhase('work')
      setTimeLeft(p.workTime)
      setCurrentCycle(1)
      setCurrentSet(s.currentSet + 1)
      return
    }
  }, [clearTimer])

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      const next = prev - 1
      // 残り3, 2, 1秒でカウントダウン音
      if (next <= 3 && next > 0) {
        playCountdownBeep()
      }
      if (next <= 0) {
        advancePhase()
        return prev // advancePhase will set the correct timeLeft
      }
      return next
    })
  }, [advancePhase])

  const start = useCallback(() => {
    // iOSのオーディオロック解除（ユーザー操作時に呼ぶ必要あり）
    unlockAudio()

    if (currentPhase === 'finished') {
      reset()
      setTimeout(() => {
        setTimerState('running')
        intervalRef.current = window.setInterval(() => {
          tick()
        }, 1000)
      }, 50)
      return
    }
    setTimerState('running')
    clearTimer()
    intervalRef.current = window.setInterval(() => {
      tick()
    }, 1000)
  }, [currentPhase, reset, clearTimer, tick])

  const pause = useCallback(() => {
    setTimerState('paused')
    clearTimer()
  }, [clearTimer])

  const toggle = useCallback(() => {
    if (timerState === 'running') {
      pause()
    } else {
      start()
    }
  }, [timerState, pause, start])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    timerState,
    currentPhase,
    timeLeft,
    currentCycle,
    currentSet,
    toggle,
    reset,
  }
}
