import {formatBaseDenom, formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'manifest_tokenomics_total_supply',
    title: (latest) => `Total MFX Supply: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Token Supply',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'total_mfx_minted',
    title: (latest) => `Total MFX Minted: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Token Minted',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'total_mfx_burned',
    title: (latest) => `Total MFX Burned: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Token Burned',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'talib_mfx_power_conversion',
    title: (latest) => `MFX:PWR Conversion Rate: ${latest ? formatRoundNumber(latest.value, 2) : "N/A"}`,
    yAxisTitle: 'MFX:PWR',
    category: 'tokenomic',
    type: "common"
  },
]
