import { computed, shallowRef } from 'vue'
import type { ToolName } from '@/types'

const storageKey = 'mobile-tools:feature-tour:v1'
const screens: readonly ToolName[] = ['cell-id', 'arfcn', 'settings']

function loadCompleted(): ToolName[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (Array.isArray(saved)) return screens.filter((screen) => saved.includes(screen))
  } catch {
    // The tour still works when browser storage is unavailable.
  }
  return []
}

export function useFeatureTour(activeScreen: () => ToolName) {
  const completed = shallowRef(loadCompleted())
  const visible = computed(() => !completed.value.includes(activeScreen()))
  const step = computed(() => screens.indexOf(activeScreen()) + 1)
  const last = computed(() => screens.every((screen) => screen === activeScreen() || completed.value.includes(screen)))

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(completed.value)) } catch {
      // Keep completion state in memory if saving is blocked.
    }
  }

  function next(): ToolName | undefined {
    completed.value = [...new Set([...completed.value, activeScreen()])]
    save()
    return screens.find((screen) => !completed.value.includes(screen))
  }

  function skip() {
    completed.value = [...screens]
    save()
  }

  return { visible, step, last, next, skip }
}
