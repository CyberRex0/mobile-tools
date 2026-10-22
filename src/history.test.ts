import { effectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createCalculationHistory, type HistoryDraft } from './history'
import { useCellIdentity } from './composables/useCellIdentity'
import { useCellIdentityHistory } from './composables/useCellIdentityHistory'
import { useArfcn } from './composables/useArfcn'
import { useArfcnHistory } from './composables/useArfcnHistory'

const storageKey = 'mobile-tools:calculation-history:v1'

function cellDraft(identity = '3160330'): HistoryDraft {
  return {
    tool: 'cell-id', title: 'LTE · IDを分解', context: '', values: [{ label: 'ECI', value: identity }],
    state: { technology: 'lte', mode: 'decompose', nrNodeBits: 24, form: { nodeId: '', cellId: '', identity } },
  }
}

function arfcnDraft(): HistoryDraft {
  return {
    tool: 'arfcn', title: 'NR · 周波数 → ARFCN', context: '日本 · DL', values: [{ label: 'NR-ARFCN', value: '640000' }],
    state: { technology: 'nr', mode: 'frequency-to-channel', direction: 'downlink', region: 'japan', form: { channel: '', frequencyMHz: '3600' } },
  }
}

describe('calculation history', () => {
  let storage: Map<string, string>
  const scopes: ReturnType<typeof effectScope>[] = []

  function scope<T>(setup: () => T) {
    const instance = effectScope()
    scopes.push(instance)
    return { value: instance.run(setup)!, stop: () => instance.stop() }
  }

  beforeEach(() => {
    vi.useFakeTimers()
    storage = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    })
  })
  afterEach(() => {
    scopes.splice(0).forEach((instance) => instance.stop())
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('saves detached snapshots and restores them on a new visit', () => {
    const history = createCalculationHistory()
    const draft = cellDraft()
    history.add(draft)
    if (draft.tool === 'cell-id') draft.state.form.identity = '1'
    const loaded = createCalculationHistory().entries.value
    expect(loaded).toEqual(history.entries.value)
    expect(loaded[0]?.state.form).toMatchObject({ identity: '3160330' })
  })

  it('moves a repeated calculation to the front without accumulating duplicates', () => {
    const history = createCalculationHistory()
    history.add(cellDraft('1'))
    history.add(cellDraft('2'))
    history.add(cellDraft('1'))
    expect(history.entries.value.map((entry) => entry.values[0]?.value)).toEqual(['1', '2'])
  })

  it('keeps the latest 50 calculations separately for each tool', () => {
    const history = createCalculationHistory()
    for (let value = 0; value < 52; value++) history.add(cellDraft(String(value)))
    history.add(arfcnDraft())
    expect(history.entries.value.filter((entry) => entry.tool === 'cell-id')).toHaveLength(50)
    expect(history.entries.value).toHaveLength(51)
    expect(history.entries.value.at(-1)?.values[0]?.value).toBe('2')
  })

  it('clears one tool without losing the other tool or the regional preference', () => {
    const history = createCalculationHistory()
    storage.set('mobile-tools:arfcn-region', 'us')
    history.add(cellDraft())
    history.add(arfcnDraft())
    history.clear('cell-id')
    expect(createCalculationHistory().entries.value.map((entry) => entry.tool)).toEqual(['arfcn'])
    history.clear()
    expect(createCalculationHistory().entries.value).toEqual([])
    expect(storage.get('mobile-tools:arfcn-region')).toBe('us')
  })

  it('ignores corrupted, obsolete, and malformed stored histories', () => {
    storage.set(storageKey, '{broken')
    expect(createCalculationHistory().entries.value).toEqual([])
    storage.set(storageKey, JSON.stringify({ version: 99, entries: [] }))
    expect(createCalculationHistory().entries.value).toEqual([])
    storage.set(storageKey, JSON.stringify({ version: 1, entries: [null, {}, { ...cellDraft(), id: 'bad-date', createdAt: 1e20 }] }))
    expect(createCalculationHistory().entries.value).toEqual([])
  })

  it('continues recording and clearing in memory if storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    })
    const history = createCalculationHistory()
    history.add(cellDraft())
    expect(history.entries.value).toHaveLength(1)
    history.clear()
    expect(history.entries.value).toEqual([])
  })

  it('records only the completed input after typing settles, and skips invalid inputs', () => {
    const history = createCalculationHistory()
    const { value: tool } = scope(() => {
      const calculator = useCellIdentity()
      useCellIdentityHistory(calculator, history)
      return calculator
    })
    tool.form.identity = '3'
    vi.advanceTimersByTime(500)
    tool.form.identity = '3160330'
    vi.advanceTimersByTime(999)
    expect(history.entries.value).toHaveLength(0)
    vi.advanceTimersByTime(1)
    expect(history.entries.value).toHaveLength(1)
    expect(history.entries.value[0]?.values).toEqual([
      { label: 'ECI', value: '3160330' }, { label: 'eNodeB ID', value: '12345' }, { label: 'Cell ID', value: '10' },
    ])
    tool.form.identity = '1'
    tool.form.identity = 'invalid'
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toHaveLength(1)
  })

  it('records a pending calculation when switching screens', () => {
    const history = createCalculationHistory()
    const instance = scope(() => {
      const calculator = useCellIdentity()
      useCellIdentityHistory(calculator, history)
      return calculator
    })
    instance.value.form.identity = '3160330'
    instance.stop()
    expect(history.entries.value).toHaveLength(1)
    history.clear()
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toEqual([])
  })

  it('restores NR cell inputs, mode, and bit length without recording the restoration', () => {
    const history = createCalculationHistory()
    const { value: { calculator, workflow } } = scope(() => {
      const calculator = useCellIdentity()
      return { calculator, workflow: useCellIdentityHistory(calculator, history) }
    })
    calculator.technology.value = 'nr'
    calculator.nrNodeBits.value = 28
    calculator.mode.value = 'compose'
    calculator.form.nodeId = '123456'
    calculator.form.cellId = '7'
    vi.advanceTimersByTime(1000)
    const entry = history.entries.value[0]!
    const expectedIdentity = calculator.result.value.value?.identity
    calculator.technology.value = 'lte'
    calculator.mode.value = 'decompose'
    calculator.form.identity = ''
    workflow.restore(entry)
    expect(calculator.technology.value).toBe('nr')
    expect(calculator.mode.value).toBe('compose')
    expect(calculator.nrNodeBits.value).toBe(28)
    expect(calculator.form).toEqual({ nodeId: '123456', cellId: '7', identity: '' })
    expect(calculator.result.value.value?.identity).toBe(expectedIdentity)
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toHaveLength(1)
    expect(history.entries.value[0]?.id).toBe(entry.id)
  })

  it('restores ARFCN technology, region, direction, mode, and original frequency', () => {
    const history = createCalculationHistory()
    const { value: { calculator, workflow } } = scope(() => {
      const calculator = useArfcn()
      return { calculator, workflow: useArfcnHistory(calculator, history) }
    })
    calculator.technology.value = 'nr'
    calculator.region.value = 'europe'
    calculator.direction.value = 'uplink'
    calculator.mode.value = 'frequency-to-channel'
    calculator.form.frequencyMHz = '3600'
    vi.advanceTimersByTime(1000)
    const entry = history.entries.value[0]!
    calculator.form.frequencyMHz = ''
    calculator.technology.value = 'lte'
    calculator.region.value = 'us'
    calculator.direction.value = 'downlink'
    calculator.mode.value = 'channel-to-frequency'
    workflow.restore(entry)
    expect(calculator.technology.value).toBe('nr')
    expect(calculator.region.value).toBe('europe')
    expect(calculator.direction.value).toBe('uplink')
    expect(calculator.mode.value).toBe('frequency-to-channel')
    expect(calculator.form.frequencyMHz).toBe('3600')
    expect(calculator.result.value.conversion?.channel).toBe(640000)
    expect(calculator.result.value.rows.map((row) => row.band)).toEqual(['n78'])
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toHaveLength(1)
  })

  it('does not save an ARFCN input that has no valid regional conversion', () => {
    const history = createCalculationHistory()
    const { value: calculator } = scope(() => {
      const calculator = useArfcn()
      useArfcnHistory(calculator, history)
      return calculator
    })
    calculator.mode.value = 'frequency-to-channel'
    calculator.form.frequencyMHz = '806'
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toHaveLength(0)
    calculator.region.value = 'europe'
    vi.advanceTimersByTime(1000)
    expect(history.entries.value).toHaveLength(1)
  })
})
