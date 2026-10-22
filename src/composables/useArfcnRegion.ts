import { shallowRef, watch } from 'vue'
import { isRegionId, type RegionId } from '@/data/regions'

const storageKey = 'mobile-tools:arfcn-region'

function savedRegion(): RegionId {
  try {
    const saved = localStorage.getItem(storageKey)
    return isRegionId(saved) ? saved : 'japan'
  } catch {
    return 'japan'
  }
}

export function useArfcnRegion() {
  const region = shallowRef<RegionId>(savedRegion())
  watch(region, (value) => {
    try {
      localStorage.setItem(storageKey, value)
    } catch {
      // Calculation remains available when browser storage is disabled.
    }
  }, { flush: 'sync' })
  return { region }
}
