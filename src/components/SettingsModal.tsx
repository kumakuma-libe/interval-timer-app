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
    <div className="flex items-center justify-between py-3">
      <label className="text-gray-200 text-base font-bold">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={0}
          max={99}
          value={min}
          onChange={e => onChange(Math.max(0, Number(e.target.value)) * 60 + sec)}
          className="w-16 bg-gray-700 text-white text-center rounded-lg px-2 py-2 text-base font-bold"
        />
        <span className="text-gray-400 text-sm font-bold">分</span>
        <input
          type="number"
          min={0}
          max={59}
          value={sec}
          onChange={e => onChange(min * 60 + Math.max(0, Math.min(59, Number(e.target.value))))}
          className="w-16 bg-gray-700 text-white text-center rounded-lg px-2 py-2 text-base font-bold"
        />
        <span className="text-gray-400 text-sm font-bold">秒</span>
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <label className="text-gray-200 text-base font-bold">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          min={1}
          max={99}
          value={value}
          onChange={e => onChange(Math.max(1, Number(e.target.value)))}
          className="w-16 bg-gray-700 text-white text-center rounded-lg px-2 py-2 text-base font-bold"
        />
        <span className="text-gray-400 text-sm font-bold">回</span>
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">⚙️ 設定</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X size={28} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Preset selector */}
          <div className="flex items-center gap-2">
            <select
              value={editIndex}
              onChange={e => setEditIndex(Number(e.target.value))}
              className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-2.5 text-base font-bold"
            >
              {editPresets.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
            <button onClick={addPreset} className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-2.5 rounded-xl transition-all">
              <Plus size={22} />
            </button>
            <button
              onClick={deletePreset}
              disabled={editPresets.length <= 1}
              className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all"
            >
              <Trash2 size={22} />
            </button>
          </div>

          {/* Preset name */}
          <div>
            <label className="text-gray-400 text-sm font-bold">プリセット名</label>
            <input
              type="text"
              value={current.name}
              onChange={e => updateCurrent({ name: e.target.value })}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-2.5 text-base font-bold mt-1"
            />
          </div>

          {/* Time settings */}
          <div className="divide-y divide-gray-700">
            <TimeInput label="準備時間" value={current.prepTime} onChange={v => updateCurrent({ prepTime: v })} />
            <TimeInput label="ワークアウト時間" value={current.workTime} onChange={v => updateCurrent({ workTime: v })} />
            <TimeInput label="休憩時間" value={current.restTime} onChange={v => updateCurrent({ restTime: v })} />
            <NumberInput label="サイクル数" value={current.cycles} onChange={v => updateCurrent({ cycles: v })} />
            <NumberInput label="セット数" value={current.sets} onChange={v => updateCurrent({ sets: v })} />
            <TimeInput label="セット間休憩" value={current.setRestTime} onChange={v => updateCurrent({ setRestTime: v })} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white py-3 rounded-2xl text-lg font-bold transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-2xl text-lg font-bold transition-all"
          >
            💾 保存
          </button>
        </div>
      </div>
    </div>
  )
}
