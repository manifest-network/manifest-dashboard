import {formatBaseDenom} from "$lib/utils/format";
import {BigNumber} from "bignumber.js";

export const configs: ChartConfig[] = [
  {
    id: 'fdv',
    title: (latest) => `Estimated FDV.: $${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Estimated FDV.',
    category: 'tokenomic',
    type: "supply"
  },
  {
    id: 'market_cap',
    title: (latest) => `Estimated Market Cap.: $${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Estimated Market Cap.',
    category: 'tokenomic',
    type: "supply"
  },
  {
    id: 'circulating_supply',
    title: (latest) => `Circulating Supply: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Circulating Supply',
    category: 'tokenomic',
    type: "supply"
  },
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
    yAxisTitle: 'MFX Minted',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'total_mfx_burned',
    title: (latest) => `Total MFX Burned: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'MFX Burned',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'total_pwr_burned',
    title: (latest) => `Total PWR Burned: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'PWR Burned',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'total_pwr_minted',
    title: (latest) => `Total PWR Minted: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'PWR Minted',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'talib_mfx_power_conversion',
    title: (latest) => `MFX:PWR Conversion Rate: ${latest ? BigNumber(latest.value).div(10) : "N/A"}`,
    yAxisTitle: 'MFX:PWR (10x)',
    category: 'tokenomic',
    type: "common"
  },
  {
    id: 'locked_tokens',
    title: (latest) => `Locked MFX (excl. fees): ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Locked MFX (excl. fees)',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'locked_fees',
    title: (latest) => `Locked MFX (fees): ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Locked MFX (fees)',
    category: 'tokenomic',
    type: "chain"
  },
]
