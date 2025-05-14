import {formatLargeNumber} from "$lib/utils/format";
import {BigNumber} from "bignumber.js";

export const configs: ChartConfig[] = [
  {
    id: 'manifest_tokenomics_total_supply',
    title: (latest) => `Total MFX Supply: ${latest ? formatLargeNumber(BigNumber(latest.value).dividedBy(1e6).toFixed(4), 4) : "N/A"}`,
    yAxisTitle: 'umfx Supply',
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
