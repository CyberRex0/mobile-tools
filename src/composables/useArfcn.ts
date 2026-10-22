import { computed, reactive, shallowRef } from 'vue'
import type { LinkDirection, RadioTechnology } from '@/types'
import { lteEarfcnFromFrequency, lteFrequencyFromEarfcn } from '@/data/lteBands'
import { findNrBands, nrArfcnFromFrequency, nrFrequencyFromArfcn } from '@/data/nrBands'
import { regionalBands } from '@/data/regions'
import { useArfcnRegion } from './useArfcnRegion'

interface Conversion { channel: number; frequencyMHz: number }
interface ArfcnRow extends Conversion { band: string; bandName: string; mode: string; direction: LinkDirection }
interface ArfcnResult { error: string; notice: string; conversion: Conversion | null; rows: ArfcnRow[] }

export function useArfcn() {
  const technology = shallowRef<RadioTechnology>('lte')
  const mode = shallowRef<'channel-to-frequency' | 'frequency-to-channel'>('channel-to-frequency')
  const direction = shallowRef<LinkDirection>('downlink')
  const { region } = useArfcnRegion()
  const form = reactive({ channel: '', frequencyMHz: '' })

  const result = computed<ArfcnResult>(() => {
    const invalid = (error = '入力値を確認してください'): ArfcnResult => ({ error, notice: '', conversion: null, rows: [] })
    const success = (rows: ArfcnRow[], conversion: Conversion, notice = ''): ArfcnResult => ({ error: '', notice, conversion, rows })
    const nrResult = (channel: number, frequencyMHz: number) => {
      const bands = regionalBands(findNrBands(frequencyMHz, direction.value), region.value, 'nr')
      const rows = bands.map((band) => ({ channel, frequencyMHz, band: band.band, bandName: band.name, mode: band.mode, direction: direction.value }))
      // NR uses a global raster: region changes band candidates, never the channel or frequency.
      return success(rows, { channel, frequencyMHz }, rows.length ? '' : region.value === 'global' ? '該当するバンドがありません' : 'この地域の候補バンドはありません')
    }

    if (mode.value === 'channel-to-frequency') {
      const channel = Number(form.channel)
      if (form.channel.trim() === '' || !Number.isInteger(channel) || channel < 0) return invalid()
      if (technology.value === 'lte') {
        const match = lteFrequencyFromEarfcn(channel)
        if (!match) return invalid('対応する LTE バンドが見つかりません')
        const row = { channel, frequencyMHz: match.frequencyMHz, band: `B${match.band.band}`, bandName: match.band.name, mode: match.band.mode, direction: match.band.mode === 'TDD' ? direction.value : match.direction }
        // An EARFCN identifies its band regardless of regional deployment preferences.
        const notice = regionalBands([row], region.value, 'lte').length ? '' : 'このバンドは地域の候補外です'
        return success([row], row, notice)
      }
      const frequencyMHz = nrFrequencyFromArfcn(channel)
      if (frequencyMHz === null) return invalid('NR-ARFCN は 0〜3,279,165 で入力してください')
      return nrResult(channel, frequencyMHz)
    }

    const frequencyMHz = Number(form.frequencyMHz)
    if (!Number.isFinite(frequencyMHz) || frequencyMHz < 0 || form.frequencyMHz.trim() === '') return invalid()
    if (technology.value === 'lte') {
      const matches = lteEarfcnFromFrequency(frequencyMHz, direction.value)
      if (!matches.length) return invalid('対応する LTE バンドが見つかりません')
      const rows = regionalBands(matches.map((match) => ({ channel: match.earfcn, frequencyMHz: match.frequencyMHz, band: `B${match.band.band}`, bandName: match.band.name, mode: match.band.mode, direction: match.direction })), region.value, 'lte')
      if (!rows.length) return invalid('この地域の候補バンドはありません。地域を変更してください')
      return success(rows, rows[0]!)
    }
    const channel = nrArfcnFromFrequency(frequencyMHz)
    if (channel === null) return invalid('周波数は 0〜100,000.08 MHz で入力してください')
    return nrResult(channel, nrFrequencyFromArfcn(channel) ?? frequencyMHz)
  })

  return { technology, mode, direction, region, form, result }
}
