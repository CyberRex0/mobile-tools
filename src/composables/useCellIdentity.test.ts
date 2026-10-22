import { describe, expect, it } from 'vitest'
import { useCellIdentity } from './useCellIdentity'

describe('useCellIdentity', () => {
  it('starts in decompose mode', () => {
    const { mode } = useCellIdentity()
    expect(mode.value).toBe('decompose')
  })
})
