import {formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'blockchain_height',
    title: (latest) => `Height: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Height',
    category: 'blockchain'
  },
  {
    id: 'total_unique_user',
    title: 'Total Wallets',
    yAxisTitle: '# of Wallets',
    category: 'blockchain'
  },
  {
    id: 'total_unique_group',
    title: 'Total Groups/DAOs',
    yAxisTitle: '# of Groups/DAOs',
    category: 'blockchain'
  },
  {
    id: 'total_tx_count',
    title: 'Total Transactions',
    yAxisTitle: '# of Transactions',
    category: 'blockchain'
  },
  {
    id: 'manifest_tokenomics_token_count',
    title: 'Total Denominations',
    yAxisTitle: '# of Denominations',
    category: 'blockchain'
  },
]
