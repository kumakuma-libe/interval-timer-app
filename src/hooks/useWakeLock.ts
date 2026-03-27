import { useRef, useEffect, useCallback } from 'react'

// タイマー実行中に画面が暗くならないようにする
export function useWakeLock(isActive: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {}
  }, [])

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release()
        wakeLockRef.current = null
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (isActive) {
      requestWakeLock()

      // ページが再表示されたときにWake Lockを再取得
      const handleVisibility = () => {
        if (document.visibilityState === 'visible' && isActive) {
          requestWakeLock()
        }
      }
      document.addEventListener('visibilitychange', handleVisibility)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibility)
        releaseWakeLock()
      }
    } else {
      releaseWakeLock()
    }
  }, [isActive, requestWakeLock, releaseWakeLock])
}
