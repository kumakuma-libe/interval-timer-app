import { useState, useCallback } from 'react'
import type { Preset } from './types'
import { loadPresets, savePresets, loadActiveIndex, saveActiveIndex } from './presets'
import { useTimer } from './hooks/useTimer'
import { TimerDisplay } from './components/TimerDisplay'
import { PresetSelector } from './components/PresetSelector'
import { SettingsModal } from './components/SettingsModal'

function App() {
  const [presets, setPresets] = useState<Preset[]>(loadPresets)
  const [activeIndex, setActiveIndex] = useState(loadActiveIndex)
  const [showSettings, setShowSettings] = useState(false)

  const activePreset = presets[activeIndex] ?? presets[0]

  const {
    timerState,
    currentPhase,
    timeLeft,
    currentCycle,
    currentSet,
    toggle,
    reset,
  } = useTimer(activePreset)

  const handlePresetChange = useCallback((index: number) => {
    setActiveIndex(index)
    saveActiveIndex(index)
  }, [])

  const handleSaveSettings = useCallback((newPresets: Preset[], newActiveIndex: number) => {
    setPresets(newPresets)
    savePresets(newPresets)
    setActiveIndex(newActiveIndex)
    saveActiveIndex(newActiveIndex)
    setShowSettings(false)
  }, [])

  return (
    <div className="relative">
      <PresetSelector
        presets={presets}
        activeIndex={activeIndex}
        onChange={handlePresetChange}
      />

      <TimerDisplay
        timerState={timerState}
        currentPhase={currentPhase}
        timeLeft={timeLeft}
        currentCycle={currentCycle}
        totalCycles={activePreset.cycles}
        currentSet={currentSet}
        totalSets={activePreset.sets}
        onToggle={toggle}
        onReset={reset}
        onOpenSettings={() => setShowSettings(true)}
      />

      {showSettings && (
        <SettingsModal
          presets={presets}
          activeIndex={activeIndex}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
