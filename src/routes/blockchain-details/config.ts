import {formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'blockchain_height_testnet',
    title: (latest) => `Height: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Height',
    category: 'blockchain'
  },
  {
    id: 'total_unique_user_testnet',
    title: 'Total Wallets',
    yAxisTitle: '# of Wallets',
    category: 'blockchain'
  },
  {
    id: 'total_unique_group_testnet',
    title: 'Total Groups/DAOs',
    yAxisTitle: '# of Groups/DAOs',
    category: 'blockchain'
  },
  {
    id: 'total_tx_count_testnet',
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
