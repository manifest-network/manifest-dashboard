<script lang="ts">
  import {formatNumber} from "$lib/utils/format";

  const {totalUniqueUser, totalDao, totalTxCount, tokenCount, blockchainHeight} = $props<{
    totalUniqueUser: string,
    totalDao: string,
    totalTxCount: string,
    tokenCount: string
    blockchainHeight: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Blockchain</h2>
    <a href="/blockchain-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(blockchainHeight)}</p>
      <p class="text-xs font-medium text-muted-foreground">Height</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalUniqueUser)}</p>
      <p class="text-xs font-medium text-muted-foreground">Wallets</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalDao)}</p>
      <p class="text-xs font-medium text-muted-foreground">Groups/DAOs</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalTxCount)}</p>
      <p class="text-xs font-medium text-muted-foreground">Transactions</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(tokenCount)}</p>
      <p class="text-xs font-medium text-muted-foreground">Unique Denominations</p>
    </div>
  </div>
</div>
