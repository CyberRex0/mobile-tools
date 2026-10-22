import { computed } from 'vue'
import type { CalculationHistory, HistoryDraft, HistoryEntry } from '@/history'
import type { useCellIdentity } from './useCellIdentity'
import { useHistoryRecorder } from './useHistoryRecorder'

export function useCellIdentityHistory(tool: ReturnType<typeof useCellIdentity>, history: CalculationHistory) {
  const entries = computed(() => history.entries.value.filter((entry) => entry.tool === 'cell-id'))
  const draft = computed<HistoryDraft | null>(() => {
    const result = tool.result.value.value
    if (!result) return null
    const technology = tool.technology.value
    const mode = tool.mode.value
    return {
      tool: 'cell-id',
      title: `${technology.toUpperCase()} · ${mode === 'compose' ? 'IDを合成' : 'IDを分解'}`,
      context: technology === 'nr' ? `gNodeB ${tool.nrNodeBits.value} bit` : '',
      state: { technology, mode, nrNodeBits: tool.nrNodeBits.value, form: { ...tool.form } },
      values: [
        { label: technology === 'lte' ? 'ECI' : 'NCI', value: result.identity.toString() },
        { label: technology === 'lte' ? 'eNodeB ID' : 'gNodeB ID', value: result.networkNodeId.toString() },
        { label: 'Cell ID', value: result.localCellId.toString() },
      ],
    }
  })
  const recorder = useHistoryRecorder(draft, history)

  function restore(entry: HistoryEntry) {
    if (entry.tool !== 'cell-id') return
    recorder.restore(() => {
      tool.technology.value = entry.state.technology
      tool.mode.value = entry.state.mode
      tool.nrNodeBits.value = entry.state.nrNodeBits
      Object.assign(tool.form, entry.state.form)
    })
  }
  return { entries, restore }
}
