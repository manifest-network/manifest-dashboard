<script lang="ts">
  import {formatLargeNumber, formatNumber} from "$lib/utils/format";

  const {totalWebsites, totalRequests} = $props<{
    totalWebsites: string
    totalRequests: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Decentralized Websites</h2>
    <a href="/decentralized-website-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalWebsites)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Websites</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalRequests)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Web Requests</p>
    </div>
  </div>
</div>
