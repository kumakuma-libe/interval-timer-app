// iPhoneでも確実に音が鳴るよう、AudioContextを使い回す
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

// iOSではユーザー操作時にAudioContextをresumeする必要がある
export function unlockAudio() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    // 無音を再生してiOSのオーディオロックを解除
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.01)
  } catch {}
}

function playTone(frequency: number, duration: number, volume = 0.4) {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = frequency
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    // フェードアウトで自然な音に
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {}
}

// カウントダウン 3, 2, 1 のビープ音（短い高音）
export function playCountdownBeep() {
  playTone(880, 150, 0.5)
}

// フェーズ開始音（ピロリン♪ 2音）
export function playStartBeep() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime

    // 1音目
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.frequency.value = 1047 // C6
    osc1.type = 'sine'
    gain1.gain.setValueAtTime(0.5, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.start(now)
    osc1.stop(now + 0.15)

    // 2音目（少し高い音）
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.frequency.value = 1319 // E6
    osc2.type = 'sine'
    gain2.gain.setValueAtTime(0.5, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc2.start(now + 0.15)
    osc2.stop(now + 0.35)
  } catch {}
}

// 完了音（ピロリロリン♪ 3音）
export function playFinishBeep() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const notes = [1047, 1319, 1568] // C6, E6, G6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const start = now + i * 0.15
      gain.gain.setValueAtTime(0.5, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3)
      osc.start(start)
      osc.stop(start + 0.3)
    })
  } catch {}
}
