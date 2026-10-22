export type RadioTechnology = 'lte' | 'nr'
export type ToolName = 'cell-id' | 'arfcn' | 'settings'
export type LinkDirection = 'downlink' | 'uplink'
export interface BandMatch { band: string; name: string; mode: string; direction: LinkDirection | 'both' }
