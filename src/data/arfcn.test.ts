import { describe, expect, it } from 'vitest'
import { lteEarfcnFromFrequency, lteFrequencyFromEarfcn } from './lteBands'
import { nrArfcnFromFrequency, nrFrequencyFromArfcn } from './nrBands'

describe('ARFCN conversions', () => {
  it('converts LTE band 3 in both directions', () => {
    expect(lteFrequencyFromEarfcn(1500)?.frequencyMHz).toBe(1835)
    expect(lteEarfcnFromFrequency(1835, 'downlink').some((item) => item.earfcn === 1500)).toBe(true)
  })
  it('converts each NR global raster segment', () => {
    expect(nrFrequencyFromArfcn(100000)).toBe(500)
    expect(nrFrequencyFromArfcn(640000)).toBe(3600)
    expect(nrFrequencyFromArfcn(2070833)).toBeCloseTo(27500.04, 2)
    expect(nrArfcnFromFrequency(3600)).toBe(640000)
  })
})
