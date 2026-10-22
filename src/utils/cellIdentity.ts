export interface CellIdentityResult {
  networkNodeId: bigint
  localCellId: bigint
  identity: bigint
  nodeBits: number
  cellBits: number
}

function requireInteger(value: string, label: string): bigint {
  const trimmed = value.trim()
  if (!/^\d+$/.test(trimmed)) throw new Error(`${label}は0以上の整数で入力してください`)
  return BigInt(trimmed)
}

function requireRange(value: bigint, bits: number, label: string) {
  const max = (1n << BigInt(bits)) - 1n
  if (value > max) throw new Error(`${label}は ${max.toString()} 以下で入力してください`)
}

export function composeCellIdentity(networkNodeIdText: string, localCellIdText: string, technology: 'lte' | 'nr', nrNodeBits = 24): CellIdentityResult {
  const nodeBits = technology === 'lte' ? 20 : nrNodeBits
  const cellBits = technology === 'lte' ? 8 : 36 - nrNodeBits
  const networkNodeId = requireInteger(networkNodeIdText, technology === 'lte' ? 'eNodeB ID' : 'gNodeB ID')
  const localCellId = requireInteger(localCellIdText, 'Cell ID')
  requireRange(networkNodeId, nodeBits, technology === 'lte' ? 'eNodeB ID' : 'gNodeB ID')
  requireRange(localCellId, cellBits, 'Cell ID')
  return { networkNodeId, localCellId, identity: (networkNodeId << BigInt(cellBits)) | localCellId, nodeBits, cellBits }
}

export function decomposeCellIdentity(identityText: string, technology: 'lte' | 'nr', nrNodeBits = 24): CellIdentityResult {
  const identity = requireInteger(identityText, technology === 'lte' ? 'ECI' : 'NCI')
  const totalBits = technology === 'lte' ? 28 : 36
  requireRange(identity, totalBits, technology === 'lte' ? 'ECI' : 'NCI')
  const nodeBits = technology === 'lte' ? 20 : nrNodeBits
  const cellBits = totalBits - nodeBits
  const mask = (1n << BigInt(cellBits)) - 1n
  return { identity, networkNodeId: identity >> BigInt(cellBits), localCellId: identity & mask, nodeBits, cellBits }
}

export function toHex(value: bigint) { return `0x${value.toString(16).toUpperCase()}` }
