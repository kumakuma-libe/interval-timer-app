import { useState, useRef, useCallback, useEffect } from 'react'
import type { Preset, TimerState, Phase } from '../types'

function playBeep(frequency: number, duration: number) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    gain.gain.value = 0.3
    osc.start()
    osc.stop(ctx.currentTime + duration / 1000)
    osc.onended = () => ctx.close()
  } catch {}
}

function playCountdownBeep() {
  playBeep(880, 100)
}

function playPhaseChangeBeep() {
  playBeep(1200, 200)
}

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
      playPhaseChangeBeep()
      setCurrentPhase('work')
      setTimeLeft(p.workTime)
      return
    }

    if (s.currentPhase === 'work') {
      // Check if this is the last cycle of the last set
      if (s.currentCycle >= p.cycles && s.currentSet >= p.sets) {
        playPhaseChangeBeep()
        setCurrentPhase('finished')
        setTimerState('idle')
        clearTimer()
        return
      }

      // If not last cycle in this set, go to rest
      if (s.currentCycle < p.cycles) {
        playPhaseChangeBeep()
        setCurrentPhase('rest')
        setTimeLeft(p.restTime)
        return
      }

      // Last cycle of current set but not last set -> setRest
      if (s.currentSet < p.sets) {
        if (p.setRestTime > 0) {
          playPhaseChangeBeep()
          setCurrentPhase('setRest')
          setTimeLeft(p.setRestTime)
        } else {
          // No set rest, go directly to next set
          playPhaseChangeBeep()
          setCurrentPhase('work')
          setTimeLeft(p.workTime)
          setCurrentCycle(1)
          setCurrentSet(s.currentSet + 1)
        }
        return
      }
    }

    if (s.currentPhase === 'rest') {
      playPhaseChangeBeep()
      setCurrentPhase('work')
      setTimeLeft(p.workTime)
      setCurrentCycle(s.currentCycle + 1)
      return
    }

    if (s.currentPhase === 'setRest') {
      playPhaseChangeBeep()
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
    if (currentPhase === 'finished') {
      reset()
      // Start after reset via setTimeout
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
