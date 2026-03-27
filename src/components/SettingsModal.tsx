import { useState } from 'react'
import type { Preset } from '../types'
import { X, Plus, Trash2 } from 'lucide-react'

interface Props {
  presets: Preset[]
  activeIndex: number
  onSave: (presets: Preset[], activeIndex: number) => void
  onClose: () => void
}

function TimeInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const min = Math.floor(value / 60)
  const sec = value % 60

  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-gray-300 text-sm">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={99}
          value={min}
          onChange={e => onChange(Math.max(0, Number(e.target.value)) * 60 + sec)}
          className="w-14 bg-gray-700 text-white text-center rounded px-2 py-1 text-sm"
        />
        <span className="text-gray-400 text-xs">分</span>
        <input
          type="number"
          min={0}
          max={59}
          value={sec}
          onChange={e => onChange(min * 60 + Math.max(0, Math.min(59, Number(e.target.value))))}
          className="w-14 bg-gray-700 text-white text-center rounded px-2 py-1 text-sm"
        />
        <span className="text-gray-400 text-xs">秒</span>
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="text-gray-300 text-sm">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={1}
          max={99}
          value={value}
          onChange={e => onChange(Math.max(1, Number(e.target.value)))}
          className="w-14 bg-gray-700 text-white text-center rounded px-2 py-1 text-sm"
        />
        <span className="text-gray-400 text-xs">回</span>
      </div>
    </div>
  )
}

export function SettingsModal({ presets, activeIndex, onSave, onClose }: Props) {
  const [editPresets, setEditPresets] = useState<Preset[]>(JSON.parse(JSON.stringify(presets)))
  const [editIndex, setEditIndex] = useState(activeIndex)

  const current = editPresets[editIndex]

  function updateCurrent(updates: Partial<Preset>) {
    setEditPresets(prev => prev.map((p, i) => i === editIndex ? { ...p, ...updates } : p))
  }

  function addPreset() {
    const newPreset: Preset = {
      name: `プリセット ${editPresets.length + 1}`,
      prepTime: 10,
      workTime: 30,
      restTime: 10,
      cycles: 5,
      sets: 1,
      setRestTime: 0,
    }
    setEditPresets([...editPresets, newPreset])
    setEditIndex(editPresets.length)
  }

  function deletePreset() {
    if (editPresets.length <= 1) return
    const newPresets = editPresets.filter((_, i) => i !== editIndex)
    setEditPresets(newPresets)
    setEditIndex(Math.min(editIndex, newPresets.length - 1))
  }

  function handleSave() {
    onSave(editPresets, editIndex)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">設定</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Preset selector */}
          <div className="flex items-center gap-2">
            <select
              value={editIndex}
              onChange={e => setEditIndex(Number(e.target.value))}
              className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            >
              {editPresets.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
            <button onClick={addPreset} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
              <Plus size={18} />
            </button>
            <button
              onClick={deletePreset}
              disabled={editPresets.length <= 1}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Preset name */}
          <div>
            <label className="text-gray-400 text-xs">プリセット名</label>
            <input
              type="text"
              value={current.name}
              onChange={e => updateCurrent({ name: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm mt-1"
            />
          </div>

          {/* Time settings */}
          <div className="divide-y divide-gray-700">
            <TimeInput label="準備時間" value={current.prepTime} onChange={v => updateCurrent({ prepTime: v })} />
            <TimeInput label="ワークアウト時間" value={current.workTime} onChange={v => updateCurrent({ workTime: v })} />
            <TimeInput label="休憩時間" value={current.restTime} onChange={v => updateCurrent({ restTime: v })} />
            <NumberInput label="サイクル数" value={current.cycles} onChange={v => updateCurrent({ cycles: v })} />
            <NumberInput label="セット数" value={current.sets} onChange={v => updateCurrent({ sets: v })} />
            <TimeInput label="セット間休憩時間" value={current.setRestTime} onChange={v => updateCurrent({ setRestTime: v })} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-xl font-medium transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
