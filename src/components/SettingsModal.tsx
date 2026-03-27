import { useState, useRef, type FocusEvent, type ChangeEvent } from 'react'
import type { Preset } from '../types'
import { X, Plus, Trash2 } from 'lucide-react'

interface Props {
  presets: Preset[]
  activeIndex: number
  onSave: (presets: Preset[], activeIndex: number) => void
  onClose: () => void
}

// iPhoneで数字入力しやすくするための共通inputスタイルとハンドラ
const numInputClass =
  'w-18 bg-gray-700 text-white text-center rounded-xl px-2 py-3 text-lg font-bold appearance-none'

function handleFocus(e: FocusEvent<HTMLInputElement>) {
  // タップ時に全選択 → そのまま上書き入力できる
  e.target.select()
}

function TimeInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const min = Math.floor(value / 60)
  const sec = value % 60
  const [minText, setMinText] = useState(String(min))
  const [secText, setSecText] = useState(String(sec))
  const prevValue = useRef(value)

  // 親の値が変わったらテキストも更新
  if (value !== prevValue.current) {
    prevValue.current = value
    setMinText(String(Math.floor(value / 60)))
    setSecText(String(value % 60))
  }

  function handleMinChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setMinText(raw)
    const n = raw === '' ? 0 : parseInt(raw, 10)
    if (!isNaN(n)) {
      const newVal = Math.max(0, Math.min(99, n)) * 60 + sec
      prevValue.current = newVal
      onChange(newVal)
    }
  }

  function handleSecChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setSecText(raw)
    const n = raw === '' ? 0 : parseInt(raw, 10)
    if (!isNaN(n)) {
      const newVal = min * 60 + Math.max(0, Math.min(59, n))
      prevValue.current = newVal
      onChange(newVal)
    }
  }

  function handleMinBlur() {
    // フォーカスが外れたら正規化
    setMinText(String(Math.floor(value / 60)))
  }

  function handleSecBlur() {
    setSecText(String(value % 60))
  }

  return (
    <div className="flex items-center justify-between py-3.5">
      <label className="text-gray-200 text-lg font-bold">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minText}
          onChange={handleMinChange}
          onFocus={handleFocus}
          onBlur={handleMinBlur}
          className={numInputClass}
        />
        <span className="text-gray-400 text-base font-bold">分</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={secText}
          onChange={handleSecChange}
          onFocus={handleFocus}
          onBlur={handleSecBlur}
          className={numInputClass}
        />
        <span className="text-gray-400 text-base font-bold">秒</span>
      </div>
    </div>
  )
}

function NumberInput({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  const [text, setText] = useState(String(value))
  const prevValue = useRef(value)

  if (value !== prevValue.current) {
    prevValue.current = value
    setText(String(value))
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setText(raw)
    const n = raw === '' ? min : parseInt(raw, 10)
    if (!isNaN(n)) {
      const clamped = Math.max(min, Math.min(99, n))
      prevValue.current = clamped
      onChange(clamped)
    }
  }

  function handleBlur() {
    setText(String(value))
  }

  return (
    <div className="flex items-center justify-between py-3.5">
      <label className="text-gray-200 text-lg font-bold">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={numInputClass}
        />
        <span className="text-gray-400 text-base font-bold">回</span>
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
      prepTime: 0,
      workTime: 0,
      restTime: 0,
      cycles: 0,
      sets: 0,
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center font-sans">
      <div className="bg-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] flex flex-col shadow-2xl safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-800 rounded-t-3xl shrink-0">
          <h2 className="text-2xl font-bold text-white">⚙️ 設定</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 -mr-2">
            <X size={28} />
          </button>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto flex-1 min-h-0">
          {/* Preset selector */}
          <div className="flex items-center gap-2">
            <select
              value={editIndex}
              onChange={e => setEditIndex(Number(e.target.value))}
              className="flex-1 bg-gray-700 text-white rounded-xl px-4 py-3 text-lg font-bold"
            >
              {editPresets.map((p, i) => (
                <option key={i} value={i}>{p.name}</option>
              ))}
            </select>
            <button onClick={addPreset} className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3 rounded-xl transition-all">
              <Plus size={24} />
            </button>
            <button
              onClick={deletePreset}
              disabled={editPresets.length <= 1}
              className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 text-white p-3 rounded-xl transition-all"
            >
              <Trash2 size={24} />
            </button>
          </div>

          {/* Preset name */}
          <div>
            <label className="text-gray-400 text-sm font-bold">プリセット名</label>
            <input
              type="text"
              value={current.name}
              onChange={e => updateCurrent({ name: e.target.value })}
              onFocus={handleFocus}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 text-lg font-bold mt-1"
            />
          </div>

          {/* Time settings */}
          <div className="divide-y divide-gray-700">
            <TimeInput label="準備時間" value={current.prepTime} onChange={v => updateCurrent({ prepTime: v })} />
            <TimeInput label="ワークアウト" value={current.workTime} onChange={v => updateCurrent({ workTime: v })} />
            <TimeInput label="休憩時間" value={current.restTime} onChange={v => updateCurrent({ restTime: v })} />
            <NumberInput label="サイクル数" value={current.cycles} onChange={v => updateCurrent({ cycles: v })} />
            <NumberInput label="セット数" value={current.sets} onChange={v => updateCurrent({ sets: v })} />
            <TimeInput label="セット間休憩" value={current.setRestTime} onChange={v => updateCurrent({ setRestTime: v })} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-gray-700 bg-gray-800 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white py-3.5 rounded-2xl text-lg font-bold transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3.5 rounded-2xl text-lg font-bold transition-all"
          >
            💾 保存
          </button>
        </div>
      </div>
    </div>
  )
}
