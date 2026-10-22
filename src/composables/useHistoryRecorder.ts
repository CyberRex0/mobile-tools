import { onScopeDispose, watch, type ComputedRef } from 'vue'
import type { CalculationHistory, HistoryDraft } from '@/history'

export function useHistoryRecorder(draft: ComputedRef<HistoryDraft | null>, history: CalculationHistory) {
  let pending: HistoryDraft | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let restoring = false

  function cancel() {
    clearTimeout(timer)
    timer = undefined
    pending = null
  }

  function flush() {
    if (pending) history.add(pending)
    cancel()
  }

  watch(draft, (value) => {
    cancel()
    if (restoring || !value) return
    pending = value
    timer = setTimeout(flush, 1000)
  }, { flush: 'sync' })

  function restore(apply: () => void) {
    // Save a completed current calculation before replacing it with a history entry.
    flush()
    restoring = true
    try { apply() } finally { restoring = false; cancel() }
  }

  if (typeof window !== 'undefined') window.addEventListener('pagehide', flush)
  onScopeDispose(() => {
    flush()
    if (typeof window !== 'undefined') window.removeEventListener('pagehide', flush)
  })

  return { restore }
}
