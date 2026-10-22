import type { RadioTechnology } from '@/types'

export type RegionId = 'japan' | 'us' | 'europe' | 'global'

interface RegionProfile {
  id: RegionId
  label: string
  lte: readonly string[]
  nr: readonly string[]
}

// Representative deployed bands, not exhaustive national spectrum allocations.
// Order is a display preference, not a measured probability. Sources: docs/regional-bands.md.
export const regions: readonly RegionProfile[] = [
  {
    id: 'japan', label: '日本',
    lte: ['B1', 'B3', 'B8', 'B11', 'B18', 'B19', 'B21', 'B26', 'B28', 'B41', 'B42'],
    nr: ['n1', 'n3', 'n28', 'n40', 'n41', 'n78', 'n77', 'n79', 'n257'],
  },
  {
    id: 'us', label: '米国',
    lte: ['B2', 'B4', 'B5', 'B12', 'B13', 'B14', 'B17', 'B25', 'B26', 'B29', 'B30', 'B41', 'B46', 'B48', 'B66', 'B71'],
    nr: ['n2', 'n5', 'n25', 'n41', 'n48', 'n66', 'n70', 'n71', 'n77', 'n258', 'n260', 'n261'],
  },
  {
    id: 'europe', label: '欧州',
    lte: ['B1', 'B3', 'B7', 'B8', 'B20', 'B28', 'B32', 'B38', 'B40', 'B42', 'B43'],
    nr: ['n1', 'n3', 'n7', 'n8', 'n20', 'n28', 'n38', 'n40', 'n78', 'n258'],
  },
  { id: 'global', label: '全世界', lte: [], nr: [] },
]

export function isRegionId(value: unknown): value is RegionId {
  return regions.some((region) => region.id === value)
}

export function regionalBands<T extends { band: string }>(matches: readonly T[], region: RegionId, technology: RadioTechnology): T[] {
  if (region === 'global') return [...matches]
  const preferred = regions.find((profile) => profile.id === region)![technology]
  return matches.filter((match) => preferred.includes(match.band))
    .sort((a, b) => preferred.indexOf(a.band) - preferred.indexOf(b.band))
}
