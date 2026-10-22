import { effectScope } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useArfcn } from './useArfcn'

describe('regional ARFCN conversion', () => {
  const scopes: ReturnType<typeof effectScope>[] = []
  let storage: Map<string, string>

  function calculator() {
    const scope = effectScope()
    scopes.push(scope)
    return scope.run(() => useArfcn())!
  }

  beforeEach(() => {
    storage = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    })
  })
  afterEach(() => {
    scopes.splice(0).forEach((scope) => scope.stop())
    vi.unstubAllGlobals()
  })

  it('selects Japanese EARFCNs instead of overlapping overseas bands', () => {
    const tool = calculator()
    expect(tool.region.value).toBe('japan')
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '880'
    expect(tool.result.value.rows.map(({ band, channel }) => [band, channel])).toEqual([
      ['B19', 6050], ['B26', 8900],
    ])
    expect(tool.result.value.conversion?.channel).toBe(6050)
    tool.region.value = 'us'
    expect(tool.result.value.rows.map(({ band, channel }) => [band, channel])).toEqual([
      ['B5', 2510], ['B26', 8900],
    ])
    expect(tool.result.value.conversion?.channel).toBe(2510)
  })

  it('keeps all overlapping candidates available in global mode', () => {
    const tool = calculator()
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '880'
    tool.region.value = 'global'
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['B5', 'B6', 'B19', 'B26'])
  })

  it('does not silently substitute an overseas LTE result when no regional band matches', () => {
    const tool = calculator()
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '806'
    expect(tool.result.value.conversion).toBeNull()
    expect(tool.result.value.error).toContain('この地域の候補バンドはありません')
    tool.region.value = 'europe'
    expect(tool.result.value.rows.map(({ band, channel }) => [band, channel])).toEqual([['B20', 6300]])
  })

  it('decodes an explicit LTE EARFCN correctly even outside the selected region', () => {
    const tool = calculator()
    tool.form.channel = '6300'
    expect(tool.result.value.conversion?.frequencyMHz).toBe(806)
    expect(tool.result.value.rows[0]?.band).toBe('B20')
    expect(tool.result.value.notice).toContain('地域の候補外')
    tool.region.value = 'europe'
    expect(tool.result.value.notice).toBe('')
  })

  it.each(['downlink', 'uplink'] as const)('uses regional NR candidates for %s without changing the global ARFCN', (direction) => {
    const tool = calculator()
    tool.technology.value = 'nr'
    tool.direction.value = direction
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '3600'
    expect(tool.result.value.conversion?.channel).toBe(640000)
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['n78', 'n77'])
    tool.region.value = 'us'
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['n48', 'n77'])
    expect(tool.result.value.conversion?.channel).toBe(640000)
    tool.region.value = 'europe'
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['n78'])
    tool.mode.value = 'channel-to-frequency'
    tool.form.channel = '640000'
    expect(tool.result.value.conversion?.frequencyMHz).toBe(3600)
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['n78'])
  })

  it('preserves valid NR conversion when the region has no candidate bands', () => {
    const tool = calculator()
    tool.technology.value = 'nr'
    tool.form.channel = '161200'
    expect(tool.result.value.conversion?.frequencyMHz).toBeCloseTo(806)
    expect(tool.result.value.rows).toEqual([])
    expect(tool.result.value.notice).toContain('この地域の候補バンドはありません')
    tool.region.value = 'europe'
    expect(tool.result.value.rows.map((row) => row.band)).toEqual(['n20'])
  })

  it('handles LTE TDD uplink using the shared frequency range', () => {
    const tool = calculator()
    tool.direction.value = 'uplink'
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '3500'
    expect(tool.result.value.rows.map(({ band, channel, direction }) => [band, channel, direction])).toEqual([['B42', 42590, 'uplink']])
    tool.mode.value = 'channel-to-frequency'
    tool.form.channel = '42590'
    expect(tool.result.value.rows[0]?.direction).toBe('uplink')
  })

  it('persists a selected region for the next visit', () => {
    const tool = calculator()
    tool.region.value = 'us'
    expect(calculator().region.value).toBe('us')
  })

  it('falls back to Japan for an unknown saved region', () => {
    storage.set('mobile-tools:arfcn-region', 'invalid')
    expect(calculator().region.value).toBe('japan')
  })

  it('works when storage cannot be read or written', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('Storage disabled') },
      setItem: () => { throw new Error('Storage disabled') },
    })
    const tool = calculator()
    expect(tool.region.value).toBe('japan')
    tool.region.value = 'europe'
    tool.form.channel = '6300'
    expect(tool.result.value.conversion?.frequencyMHz).toBe(806)
  })

  it('keeps invalid inputs out of the regional results', () => {
    const tool = calculator()
    expect(tool.result.value.conversion).toBeNull()
    tool.form.channel = '1.5'
    expect(tool.result.value.conversion).toBeNull()
    tool.technology.value = 'nr'
    tool.form.channel = '3279166'
    expect(tool.result.value.conversion).toBeNull()
    tool.mode.value = 'frequency-to-channel'
    tool.form.frequencyMHz = '-1'
    expect(tool.result.value.conversion).toBeNull()
  })
})
