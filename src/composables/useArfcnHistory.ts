import { computed } from 'vue'
import type { CalculationHistory, HistoryDraft, HistoryEntry } from '@/history'
import { regions } from '@/data/regions'
import type { useArfcn } from './useArfcn'
import { useHistoryRecorder } from './useHistoryRecorder'

export function useArfcnHistory(tool: ReturnType<typeof useArfcn>, history: CalculationHistory) {
  const entries = computed(() => history.entries.value.filter((entry) => entry.tool === 'arfcn'))
  const draft = computed<HistoryDraft | null>(() => {
    const result = tool.result.value
    if (!result.conversion) return null
    const technology = tool.technology.value
    const mode = tool.mode.value
    const region = tool.region.value
    const direction = tool.direction.value
    const channelLabel = technology === 'lte' ? 'EARFCN' : 'NR-ARFCN'
    return {
      tool: 'arfcn',
      title: `${technology.toUpperCase()} · ${mode === 'channel-to-frequency' ? 'ARFCN → 周波数' : '周波数 → ARFCN'}`,
      context: `${regions.find((item) => item.id === region)?.label} · ${direction === 'downlink' ? 'DL' : 'UL'}`,
      state: { technology, mode, region, direction, form: { ...tool.form } },
      values: [
        { label: channelLabel, value: result.conversion.channel.toLocaleString('ja-JP') },
        { label: '中心周波数', value: `${Number(result.conversion.frequencyMHz.toFixed(3))} MHz` },
        { label: 'バンド', value: result.rows.map((row) => row.band).join(' / ') || '—' },
      ],
    }
  })
  const recorder = useHistoryRecorder(draft, history)

  function restore(entry: HistoryEntry) {
    if (entry.tool !== 'arfcn') return
    recorder.restore(() => {
      tool.technology.value = entry.state.technology
      tool.mode.value = entry.state.mode
      tool.region.value = entry.state.region
      tool.direction.value = entry.state.direction
      Object.assign(tool.form, entry.state.form)
    })
  }
  return { entries, restore }
}
