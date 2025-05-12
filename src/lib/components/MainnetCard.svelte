<script lang="ts">
  import {formatNumber} from "$lib/utils/format";

  const {totalUniqueUser, totalDao, totalTxCount, tokenCount} = $props<{
    totalUniqueUser: number,
    totalDao: number,
    totalTxCount: number,
    tokenCount: number
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Testnet Blockchain</h2>
    <a href="/" class="text-sm text-primary-500 hover:underline">View Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalUniqueUser)}</p>
      <p class="text-sm font-semibold mb-3">Wallets</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalDao)}</p>
      <p class="text-sm font-semibold mb-3">Group/DAO</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalTxCount)}</p>
      <p class="text-sm font-semibold mb-3">Transactions</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(tokenCount)}</p>
      <p class="text-sm font-semibold mb-3">Unique Denominations</p>
    </div>
  </div>
</div>
