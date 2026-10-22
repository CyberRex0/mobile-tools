import { shallowRef } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFeatureTour } from './useFeatureTour'
import type { ToolName } from '@/types'

describe('first-visit feature tour', () => {
  let storage: Map<string, string>
  beforeEach(() => {
    storage = new Map()
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('guides through each screen in order and stays dismissed after completion', () => {
    const screen = shallowRef<ToolName>('cell-id')
    const tour = useFeatureTour(() => screen.value)
    expect(tour.visible.value).toBe(true)
    expect(tour.step.value).toBe(1)
    expect(tour.next()).toBe('arfcn')
    screen.value = 'arfcn'
    expect(tour.visible.value).toBe(true)
    expect(tour.step.value).toBe(2)
    expect(tour.next()).toBe('settings')
    screen.value = 'settings'
    expect(tour.step.value).toBe(3)
    expect(tour.last.value).toBe(true)
    expect(tour.next()).toBeUndefined()
    expect(tour.visible.value).toBe(false)
    for (const screen of ['cell-id', 'arfcn', 'settings'] as const) {
      expect(useFeatureTour(() => screen).visible.value).toBe(false)
    }
  })

  it('does not repeat acknowledged screens when returning manually', () => {
    const screen = shallowRef<ToolName>('cell-id')
    const tour = useFeatureTour(() => screen.value)
    tour.next()
    expect(useFeatureTour(() => 'cell-id').visible.value).toBe(false)
    screen.value = 'settings'
    expect(tour.visible.value).toBe(true)
    expect(tour.next()).toBe('arfcn')
    screen.value = 'cell-id'
    expect(tour.visible.value).toBe(false)
  })

  it('skips all remaining guidance without showing it on a later visit', () => {
    const tour = useFeatureTour(() => 'cell-id')
    tour.skip()
    expect(tour.visible.value).toBe(false)
    expect(useFeatureTour(() => 'arfcn').visible.value).toBe(false)
    expect(useFeatureTour(() => 'settings').visible.value).toBe(false)
  })

  it('handles malformed saved state', () => {
    storage.set('mobile-tools:feature-tour:v1', '{invalid')
    expect(useFeatureTour(() => 'cell-id').visible.value).toBe(true)
    storage.set('mobile-tools:feature-tour:v1', JSON.stringify(['unknown', null, 'arfcn']))
    expect(useFeatureTour(() => 'cell-id').visible.value).toBe(true)
    expect(useFeatureTour(() => 'arfcn').visible.value).toBe(false)
  })

  it('allows completion when storage is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    })
    const tour = useFeatureTour(() => 'cell-id')
    expect(tour.visible.value).toBe(true)
    tour.skip()
    expect(tour.visible.value).toBe(false)
  })
})
