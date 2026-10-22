import { inject, shallowRef, type InjectionKey } from 'vue'
import type { LinkDirection, RadioTechnology } from '@/types'
import { isRegionId, type RegionId } from '@/data/regions'

export interface CellHistoryState {
  technology: RadioTechnology
  mode: 'compose' | 'decompose'
  nrNodeBits: number
  form: { nodeId: string; cellId: string; identity: string }
}

export interface ArfcnHistoryState {
  technology: RadioTechnology
  mode: 'channel-to-frequency' | 'frequency-to-channel'
  direction: LinkDirection
  region: RegionId
  form: { channel: string; frequencyMHz: string }
}

interface HistoryDisplay {
  title: string
  context: string
  values: Array<{ label: string; value: string }>
}

export type HistoryDraft = HistoryDisplay & (
  | { tool: 'cell-id'; state: CellHistoryState }
  | { tool: 'arfcn'; state: ArfcnHistoryState }
)
export type HistoryEntry = HistoryDraft & { id: string; createdAt: number }
export type HistoryTool = HistoryEntry['tool']

const storageKey = 'mobile-tools:calculation-history:v1'
const limitPerTool = 50

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function text(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 4096
}

function validEntry(value: unknown): value is HistoryEntry {
  if (!record(value) || !text(value.id) || typeof value.createdAt !== 'number' || !Number.isFinite(value.createdAt) || value.createdAt < 0 || value.createdAt > 8640000000000000
    || !text(value.title) || !text(value.context) || !Array.isArray(value.values) || value.values.length > 8
    || !value.values.every((item) => record(item) && text(item.label) && text(item.value))) return false
  const state = value.state
  if (!record(state) || !['lte', 'nr'].includes(String(state.technology)) || !record(state.form)) return false
  if (value.tool === 'cell-id') {
    return (state.mode === 'compose' || state.mode === 'decompose')
      && typeof state.nrNodeBits === 'number' && Number.isInteger(state.nrNodeBits) && state.nrNodeBits >= 22 && state.nrNodeBits <= 32
      && text(state.form.nodeId) && text(state.form.cellId) && text(state.form.identity)
  }
  return value.tool === 'arfcn' && (state.mode === 'channel-to-frequency' || state.mode === 'frequency-to-channel')
    && (state.direction === 'downlink' || state.direction === 'uplink') && isRegionId(state.region)
    && text(state.form.channel) && text(state.form.frequencyMHz)
}

function signature(entry: HistoryDraft) {
  const state = entry.state
  if (entry.tool === 'cell-id') {
    const cell = entry.state
    return JSON.stringify([entry.tool, cell.technology, cell.mode, cell.technology === 'nr' ? cell.nrNodeBits : 20,
      cell.mode === 'compose' ? [cell.form.nodeId.trim(), cell.form.cellId.trim()] : cell.form.identity.trim()])
  }
  const arfcn = entry.state
  return JSON.stringify([entry.tool, state.technology, arfcn.mode, arfcn.region, arfcn.direction,
    arfcn.mode === 'channel-to-frequency' ? arfcn.form.channel.trim() : arfcn.form.frequencyMHz.trim()])
}

function bounded(entries: HistoryEntry[]) {
  const seen = new Set<string>()
  const counts = { 'cell-id': 0, arfcn: 0 }
  return entries.filter((entry) => {
    const key = signature(entry)
    if (seen.has(key) || counts[entry.tool] >= limitPerTool) return false
    seen.add(key)
    counts[entry.tool]++
    return true
  })
}

export function createCalculationHistory() {
  const entries = shallowRef<HistoryEntry[]>([])
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (record(saved) && saved.version === 1 && Array.isArray(saved.entries)) {
      entries.value = bounded(saved.entries.filter(validEntry).sort((a, b) => b.createdAt - a.createdAt))
    }
  } catch {
    // History remains available in memory when storage is unavailable or damaged.
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, entries: entries.value }))
    } catch {
      // Calculation and in-memory history do not depend on available storage.
    }
  }

  function add(draft: HistoryDraft) {
    const snapshot = JSON.parse(JSON.stringify(draft)) as HistoryDraft
    const createdAt = Date.now()
    const entry = { ...snapshot, id: crypto.randomUUID(), createdAt }
    entries.value = bounded([entry, ...entries.value.filter((old) => signature(old) !== signature(draft))])
    persist()
  }

  function clear(tool?: HistoryTool) {
    entries.value = tool ? entries.value.filter((entry) => entry.tool !== tool) : []
    persist()
  }

  return { entries, add, clear }
}

export type CalculationHistory = ReturnType<typeof createCalculationHistory>
export const calculationHistoryKey: InjectionKey<CalculationHistory> = Symbol('calculationHistory')

export function useCalculationHistory() {
  const history = inject(calculationHistoryKey)
  if (!history) throw new Error('Calculation history provider is missing')
  return history
}
