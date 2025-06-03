import {formatRoundNumber} from "$lib/utils/format";

export const configs: ChartConfig[] = [
  {
    id: 'blockchain_height',
    title: (latest) => `Height: ${latest ? formatRoundNumber(latest.value) : "N/A"}`,
    yAxisTitle: 'Height',
    category: 'blockchain',
    type: "chain"
  },
  {
    id: 'total_unique_user',
    title: 'Wallets',
    yAxisTitle: '# of Wallets',
    category: 'blockchain',
    type: "chain"
  },
  {
    id: 'total_unique_group',
    title: 'Groups/DAOs',
    yAxisTitle: '# of Groups/DAOs',
    category: 'blockchain',
    type: "chain"
  },
  {
    id: 'total_tx_count',
    title: 'Transactions',
    yAxisTitle: '# of Transactions',
    category: 'blockchain',
    type: "chain"
  },
  {
    id: 'manifest_tokenomics_token_count',
    title: 'Unique Denominations',
    yAxisTitle: '# of Denominations',
    category: 'blockchain',
    type: "chain"
  },
]
