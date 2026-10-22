import type { LinkDirection } from '@/types'

export interface LteBand {
  band: number
  name: string
  mode: 'FDD' | 'TDD' | 'SDL'
  downlink: { lowMHz: number; offset: number; min: number; max: number }
  uplink?: { lowMHz: number; offset: number; min: number; max: number }
}

const fdd = (band: number, name: string, dlLow: number, dlOffset: number, dlMin: number, dlMax: number, ulLow: number, ulOffset: number, ulMin: number, ulMax: number): LteBand => ({
  band, name, mode: 'FDD', downlink: { lowMHz: dlLow, offset: dlOffset, min: dlMin, max: dlMax }, uplink: { lowMHz: ulLow, offset: ulOffset, min: ulMin, max: ulMax },
})
const tdd = (band: number, name: string, low: number, offset: number, min: number, max: number): LteBand => ({ band, name, mode: 'TDD', downlink: { lowMHz: low, offset, min, max } })
const sdl = (band: number, name: string, low: number, offset: number, min: number, max: number): LteBand => ({ band, name, mode: 'SDL', downlink: { lowMHz: low, offset, min, max } })

export const lteBands: LteBand[] = [
  fdd(1, '2100', 2110, 0, 0, 599, 1920, 18000, 18000, 18599),
  fdd(2, '1900 PCS', 1930, 600, 600, 1199, 1850, 18600, 18600, 19199),
  fdd(3, '1800', 1805, 1200, 1200, 1949, 1710, 19200, 19200, 19949),
  fdd(4, 'AWS-1', 2110, 1950, 1950, 2399, 1710, 19950, 19950, 20399),
  fdd(5, '850', 869, 2400, 2400, 2649, 824, 20400, 20400, 20649),
  fdd(6, '850 Japan', 875, 2650, 2650, 2749, 830, 20650, 20650, 20749),
  fdd(7, '2600', 2620, 2750, 2750, 3449, 2500, 20750, 20750, 21449),
  fdd(8, '900 GSM', 925, 3450, 3450, 3799, 880, 21450, 21450, 21799),
  fdd(9, '1800 Japan', 1844.9, 3800, 3800, 4149, 1749.9, 21800, 21800, 22149),
  fdd(10, 'AWS-3', 2110, 4150, 4150, 4749, 1710, 22150, 22150, 22749),
  fdd(11, '1500 Lower', 1475.9, 4750, 4750, 4949, 1427.9, 22750, 22750, 22949),
  fdd(12, '700 a', 729, 5010, 5010, 5179, 699, 23010, 23010, 23179),
  fdd(13, '700 c', 746, 5180, 5180, 5279, 777, 23180, 23180, 23279),
  fdd(14, '700 PS', 758, 5280, 5280, 5379, 788, 23280, 23280, 23379),
  fdd(17, '700 b', 734, 5730, 5730, 5849, 704, 23730, 23730, 23849),
  fdd(18, '800 Lower Japan', 860, 5850, 5850, 5999, 815, 23850, 23850, 23999),
  fdd(19, '800 Upper Japan', 875, 6000, 6000, 6149, 830, 24000, 24000, 24149),
  fdd(20, '800 DD', 791, 6150, 6150, 6449, 832, 24150, 24150, 24449),
  fdd(21, '1500 Upper Japan', 1495.9, 6450, 6450, 6599, 1447.9, 24450, 24450, 24599),
  fdd(22, '3500', 3510, 6600, 6600, 7399, 3410, 24600, 24600, 25399),
  fdd(23, '2000 S-band', 2180, 7500, 7500, 7699, 2000, 25500, 25500, 25699),
  fdd(24, '1600 L-band', 1525, 7700, 7700, 8039, 1626.5, 25700, 25700, 26039),
  fdd(25, '1900+', 1930, 8040, 8040, 8689, 1850, 26040, 26040, 26689),
  fdd(26, '850+', 859, 8690, 8690, 9039, 814, 26690, 26690, 27039),
  fdd(27, '800 SMR', 852, 9040, 9040, 9209, 807, 27040, 27040, 27209),
  fdd(28, '700 APT', 758, 9210, 9210, 9659, 703, 27210, 27210, 27659),
  sdl(29, '700 d', 717, 9660, 9660, 9769),
  fdd(30, '2300 WCS', 2350, 9770, 9770, 9869, 2305, 27660, 27660, 27759),
  fdd(31, '450', 462.5, 9870, 9870, 9919, 452.5, 27760, 27760, 27809),
  sdl(32, '1500 L-band', 1452, 9920, 9920, 10359),
  tdd(33, 'TD 1900', 1900, 36000, 36000, 36199), tdd(34, 'TD 2000', 2010, 36200, 36200, 36349),
  tdd(35, 'TD PCS Lower', 1850, 36350, 36350, 36949), tdd(36, 'TD PCS Upper', 1930, 36950, 36950, 37549),
  tdd(37, 'TD PCS Center gap', 1910, 37550, 37550, 37749),
  tdd(38, 'TD 2600', 2570, 37750, 37750, 38249), tdd(39, 'TD 1900+', 1880, 38250, 38250, 38649),
  tdd(40, 'TD 2300', 2300, 38650, 38650, 39649), tdd(41, 'TD 2500', 2496, 39650, 39650, 41589),
  tdd(42, 'TD 3500', 3400, 41590, 41590, 43589), tdd(43, 'TD 3700', 3600, 43590, 43590, 45589),
  tdd(44, 'TD 700', 703, 45590, 45590, 46589), tdd(45, 'TD 1500', 1447, 46590, 46590, 46789),
  tdd(46, 'TD Unlicensed', 5150, 46790, 46790, 54539), tdd(47, 'TD V2X', 5855, 54540, 54540, 55239),
  tdd(48, 'TD 3600', 3550, 55240, 55240, 56739), tdd(49, 'TD 3600+', 3550, 56740, 56740, 58239),
  tdd(50, 'TD 1500+', 1432, 58240, 58240, 59089), tdd(51, 'TD 1500-', 1427, 59090, 59090, 59139),
  tdd(52, 'TD 3300', 3300, 59140, 59140, 60139), tdd(53, 'TD 2500', 2483.5, 60140, 60140, 60254),
  fdd(65, '2100+', 2110, 65536, 65536, 66435, 1920, 131072, 131072, 131971),
  fdd(66, 'AWS+', 2110, 66436, 66436, 67335, 1710, 131972, 131972, 132671),
  sdl(67, '700 EU', 738, 67336, 67336, 67535),
  fdd(68, '700 ME', 753, 67536, 67536, 67835, 698, 132672, 132672, 132971),
  sdl(69, '2600 SDL', 2570, 67836, 67836, 68335),
  fdd(70, 'AWS-4', 1995, 68336, 68336, 68485, 1695, 132972, 132972, 133121),
  fdd(71, '600', 617, 68586, 68586, 68935, 663, 133122, 133122, 133471),
  fdd(72, '450 PMR', 461, 68936, 68936, 68985, 451, 133472, 133472, 133521),
  fdd(73, '450 APAC', 460, 68986, 68986, 69035, 450, 133522, 133522, 133571),
  fdd(74, 'L-band', 1475, 69036, 69036, 69465, 1427, 133572, 133572, 134001),
  fdd(85, '700 a+', 728, 70366, 70366, 70545, 698, 134002, 134002, 134181),
  fdd(87, '410', 420, 70546, 70546, 70595, 410, 134182, 134182, 134231),
  fdd(88, '410+', 422, 70596, 70596, 70645, 412, 134232, 134232, 134281),
]

export function lteFrequencyFromEarfcn(earfcn: number) {
  for (const band of lteBands) {
    const directions: Array<[LinkDirection, LteBand['downlink'] | undefined]> = [['downlink', band.downlink], ['uplink', band.uplink]]
    for (const [direction, range] of directions) {
      if (range && earfcn >= range.min && earfcn <= range.max) return { frequencyMHz: range.lowMHz + 0.1 * (earfcn - range.offset), band, direction }
    }
  }
  return null
}

export function lteEarfcnFromFrequency(frequencyMHz: number, direction: LinkDirection) {
  return lteBands.flatMap((band) => {
    const range = direction === 'downlink' || band.mode === 'TDD' ? band.downlink : band.uplink
    if (!range) return []
    const channel = Math.round(range.offset + (frequencyMHz - range.lowMHz) / 0.1)
    const resolved = range.lowMHz + 0.1 * (channel - range.offset)
    if (channel < range.min || channel > range.max || Math.abs(resolved - frequencyMHz) > 0.050001) return []
    return [{ earfcn: channel, frequencyMHz: resolved, band, direction }]
  })
}
