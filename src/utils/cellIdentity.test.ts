import { describe, expect, it } from 'vitest'
import { composeCellIdentity, decomposeCellIdentity } from './cellIdentity'

describe('cell identity', () => {
  it('composes and decomposes LTE ECI', () => {
    const composed = composeCellIdentity('12345', '10', 'lte')
    expect(composed.identity).toBe(3160330n)
    expect(decomposeCellIdentity('3160330', 'lte').networkNodeId).toBe(12345n)
  })
  it('uses 24 gNodeB bits by default', () => {
    const composed = composeCellIdentity('123456', '321', 'nr')
    expect(composed.cellBits).toBe(12)
    expect(decomposeCellIdentity(composed.identity.toString(), 'nr').localCellId).toBe(321n)
  })
  it('rejects values outside their bit width', () => {
    expect(() => composeCellIdentity('1048576', '0', 'lte')).toThrow()
    expect(() => composeCellIdentity('1', '256', 'lte')).toThrow()
  })
})
