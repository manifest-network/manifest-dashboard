import {formatBaseDenom} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'manifest_tokenomics_total_supply',
    title: (latest) => `Total MFX Supply: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'umfx Supply',
    category: 'tokenomic'
  },
  {
    id: 'total_mfx_burned_testnet',
    title: (latest) => `Total MFX Burned: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'MFX Burned',
    category: 'tokenomic'
  },
  {
    id: 'total_mfx_minted_testnet',
    title: (latest) => `Total MFX Minted: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'MFX Minted',
    category: 'tokenomic'
  },
]
