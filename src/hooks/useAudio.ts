// iPhoneでも確実に音が鳴るよう、AudioContextを使い回す
// サイレントモードでもWeb Audio APIは音が鳴る（iOS Safari仕様）
let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

// iOSではユーザー操作時にAudioContextをresumeする必要がある
// これによりサイレントモードでもWeb Audio APIの音が有効になる
export function unlockAudio() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }
    // 無音を再生してiOSのオーディオロックを解除
    const buffer = ctx.createBuffer(1, 1, 22050)
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(0)
  } catch {}
}

function playTone(frequency: number, duration: number, volume = 1.0) {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    // コンプレッサーで音圧を上げる
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -10
    compressor.knee.value = 5
    compressor.ratio.value = 4
    compressor.attack.value = 0.003
    compressor.release.value = 0.05

    osc.connect(gain)
    gain.connect(compressor)
    compressor.connect(ctx.destination)

    osc.frequency.value = frequency
    osc.type = 'square' // squareの方がsineより音が大きく聞こえる
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration / 1000)
  } catch {}
}

// カウントダウン 3, 2, 1 のビープ音（大きく短い高音）
export function playCountdownBeep() {
  playTone(880, 200, 1.0)
}

// フェーズ開始音（ピロリン♪ 2音 大きめ）
export function playStartBeep() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -10
    compressor.knee.value = 5
    compressor.ratio.value = 4
    compressor.attack.value = 0.003
    compressor.release.value = 0.05
    compressor.connect(ctx.destination)

    // 1音目
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.connect(gain1)
    gain1.connect(compressor)
    osc1.frequency.value = 1047 // C6
    osc1.type = 'square'
    gain1.gain.setValueAtTime(1.0, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc1.start(now)
    osc1.stop(now + 0.2)

    // 2音目（少し高い音）
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.connect(gain2)
    gain2.connect(compressor)
    osc2.frequency.value = 1319 // E6
    osc2.type = 'square'
    gain2.gain.setValueAtTime(1.0, now + 0.2)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    osc2.start(now + 0.2)
    osc2.stop(now + 0.45)
  } catch {}
}

// 完了音（ピロリロリン♪ 3音 大きめ）
export function playFinishBeep() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const notes = [1047, 1319, 1568] // C6, E6, G6

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -10
    compressor.knee.value = 5
    compressor.ratio.value = 4
    compressor.attack.value = 0.003
    compressor.release.value = 0.05
    compressor.connect(ctx.destination)

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(compressor)
      osc.frequency.value = freq
      osc.type = 'square'
      const start = now + i * 0.2
      gain.gain.setValueAtTime(1.0, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
      osc.start(start)
      osc.stop(start + 0.35)
    })
  } catch {}
}
