import type { BandMatch, LinkDirection } from '@/types'

interface NrBandRange { band: string; name: string; mode: 'FDD' | 'TDD' | 'SDL' | 'SUL'; downlink?: [number, number]; uplink?: [number, number] }
const fdd = (band: string, name: string, dl: [number, number], ul: [number, number]): NrBandRange => ({ band, name, mode: 'FDD', downlink: dl, uplink: ul })
const tdd = (band: string, name: string, range: [number, number]): NrBandRange => ({ band, name, mode: 'TDD', downlink: range, uplink: range })
const sdl = (band: string, name: string, range: [number, number]): NrBandRange => ({ band, name, mode: 'SDL', downlink: range })
const sul = (band: string, name: string, range: [number, number]): NrBandRange => ({ band, name, mode: 'SUL', uplink: range })

export const nrBands: NrBandRange[] = [
  fdd('n1', '2100', [2110, 2170], [1920, 1980]), fdd('n2', '1900 PCS', [1930, 1990], [1850, 1910]),
  fdd('n3', '1800', [1805, 1880], [1710, 1785]), fdd('n5', '850', [869, 894], [824, 849]),
  fdd('n7', '2600', [2620, 2690], [2500, 2570]), fdd('n8', '900', [925, 960], [880, 915]),
  fdd('n12', '700 a', [729, 746], [699, 716]), fdd('n13', '700 c', [746, 756], [777, 787]),
  fdd('n14', '700 PS', [758, 768], [788, 798]), fdd('n18', '800 Lower', [860, 875], [815, 830]),
  fdd('n20', '800 DD', [791, 821], [832, 862]), fdd('n25', '1900+', [1930, 1995], [1850, 1915]),
  fdd('n24', '1600 L', [1525, 1559], [1626.5, 1660.5]), fdd('n26', '850+', [859, 894], [814, 849]), fdd('n28', '700 APT', [758, 803], [703, 748]),
  sdl('n29', '700 d', [717, 728]), fdd('n30', '2300 WCS', [2350, 2360], [2305, 2315]),
  fdd('n31', '450', [462.5, 467.5], [452.5, 457.5]),
  tdd('n34', 'TD 2000', [2010, 2025]), tdd('n38', 'TD 2600', [2570, 2620]),
  tdd('n39', 'TD 1900+', [1880, 1920]), tdd('n40', 'TD 2300', [2300, 2400]),
  tdd('n41', 'TD 2500', [2496, 2690]), tdd('n46', '5 GHz unlicensed', [5150, 5925]), tdd('n47', 'V2X', [5855, 5925]),
  tdd('n48', 'CBRS', [3550, 3700]), tdd('n50', 'TD 1500+', [1432, 1517]), tdd('n51', 'TD 1500-', [1427, 1432]), tdd('n53', 'TD 2500', [2483.5, 2495]),
  fdd('n65', '2100+', [2110, 2200], [1920, 2010]), fdd('n66', 'AWS', [2110, 2200], [1710, 1780]),
  sdl('n67', '700 EU', [738, 758]), fdd('n68', '700 ME', [753, 783], [698, 728]), fdd('n70', 'AWS-4', [1995, 2020], [1695, 1710]),
  fdd('n71', '600', [617, 652], [663, 698]), fdd('n74', 'L-band', [1475, 1518], [1427, 1470]),
  sdl('n75', 'DL 1500+', [1432, 1517]), sdl('n76', 'DL 1500-', [1427, 1432]),
  tdd('n77', 'TD 3700', [3300, 4200]), tdd('n78', 'TD 3500', [3300, 3800]), tdd('n79', 'TD 4700', [4400, 5000]),
  sul('n80', 'UL n3', [1710, 1785]), sul('n81', 'UL n8', [880, 915]), sul('n82', 'UL n20', [832, 862]),
  sul('n83', 'UL n28', [703, 748]), sul('n84', 'UL n1', [1920, 1980]), fdd('n85', '700 a+', [728, 746], [698, 716]),
  sul('n86', 'UL n66', [1710, 1780]), fdd('n87', '410', [420, 425], [410, 415]), fdd('n88', '410+', [422, 427], [412, 417]), sul('n89', 'UL n5', [824, 849]),
  tdd('n90', 'TD 2500+', [2496, 2690]), tdd('n96', '6 GHz', [5925, 7125]),
  sul('n95', 'UL n34', [2010, 2025]), sul('n97', 'UL n40', [2300, 2400]), sul('n98', 'UL n39', [1880, 1920]), sul('n99', 'UL n24', [1626.5, 1660.5]),
  tdd('n101', 'RMR 1900', [1900, 1910]),
  tdd('n102', 'Lower 6 GHz', [5925, 6425]), tdd('n104', '7 GHz', [6425, 7125]),
  tdd('n257', '28 GHz', [26500, 29500]), tdd('n258', '26 GHz', [24250, 27500]),
  tdd('n260', '39 GHz', [37000, 40000]), tdd('n261', '28 GHz US', [27500, 28350]), tdd('n262', '47 GHz', [47200, 48200]),
]

export function nrFrequencyFromArfcn(arfcn: number) {
  if (!Number.isInteger(arfcn) || arfcn < 0 || arfcn > 3279165) return null
  if (arfcn <= 599999) return arfcn * 0.005
  if (arfcn <= 2016666) return 3000 + (arfcn - 600000) * 0.015
  return 24250.08 + (arfcn - 2016667) * 0.06
}

export function nrArfcnFromFrequency(frequencyMHz: number) {
  if (!Number.isFinite(frequencyMHz) || frequencyMHz < 0 || frequencyMHz > 100000.08) return null
  if (frequencyMHz < 3000) return Math.round(frequencyMHz / 0.005)
  if (frequencyMHz < 24250.08) return Math.round(600000 + (frequencyMHz - 3000) / 0.015)
  return Math.round(2016667 + (frequencyMHz - 24250.08) / 0.06)
}

export function findNrBands(frequencyMHz: number, direction: LinkDirection): BandMatch[] {
  return nrBands.flatMap((band) => {
    const range = direction === 'downlink' ? band.downlink : band.uplink
    if (!range || frequencyMHz < range[0] || frequencyMHz > range[1]) return []
    return [{ band: band.band, name: band.name, mode: band.mode, direction }]
  })
}
