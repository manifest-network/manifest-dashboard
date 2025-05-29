<script lang="ts">
  import {formatLargeNumber, formatNumber} from "$lib/utils/format";

  const {totalWebsites, totalRequests} = $props<{
    totalWebsites: string
    totalRequests: string
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Decentralized Websites</h2>
    <a href="/decentralized-website-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalWebsites)}</p>
      <p class="text-sm font-semibold mb-3">Total Websites</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatLargeNumber(totalRequests)}</p>
      <p class="text-sm font-semibold mb-3">Total Web Requests</p>
    </div>
  </div>
</div>
