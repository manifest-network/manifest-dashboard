<script lang="ts">
  import {formatNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {totalUniqueUser, totalDao, totalTxCount, tokenCount, blockchainHeight} = $props<{
    totalUniqueUser: string,
    totalDao: string,
    totalTxCount: string,
    tokenCount: string
    blockchainHeight: string
  }>();
</script>

<Card title="Blockchain" href="/blockchain-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(blockchainHeight)} label="Height" />
    <Metric value={formatNumber(totalUniqueUser)}  label="Wallets" />
    <Metric value={formatNumber(totalDao)}         label="Groups/DAOs" />
    <Metric value={formatNumber(totalTxCount)}     label="Transactions" />
    <Metric value={formatNumber(tokenCount)}       label="Token Symbols" />
  </div>
</Card>
