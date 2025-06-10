import {formatBaseDenom} from "$lib/utils/format";
import {BigNumber} from "bignumber.js";

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
    title: (latest) => `MFX:PWR Conversion Rate: ${latest ? BigNumber(latest.value).div(10) : "N/A"}`,
    yAxisTitle: 'MFX:PWR (10x)',
    category: 'tokenomic',
    type: "common"
  },
  {
    id: 'locked_tokens',
    title: (latest) => `Locked MFX: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Locked Tokens',
    category: 'tokenomic',
    type: "chain"
  },
  {
    id: 'circulating_supply',
    title: (latest) => `Circulating Supply: ${latest ? formatBaseDenom(latest.value) : "N/A"}`,
    yAxisTitle: 'Circulating Supply',
    category: 'tokenomic',
    type: "supply"
  },
]
