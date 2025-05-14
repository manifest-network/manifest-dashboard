import {formatLargeNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'manifest_tokenomics_total_supply',
    title: 'Total MFX Supply',
    yAxisTitle: 'MFX Supply',
    category: 'tokenomic'
  },
  {
    id: 'total_mfx_burned_testnet',
    title: (latest) => `Total MFX Burned: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'MFX Burned',
    category: 'tokenomic'
  },
  {
    id: 'total_mfx_minted_testnet',
    title: (latest) => `Total MFX Minted: ${latest ? formatLargeNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'MFX Minted',
    category: 'tokenomic'
  },
]
