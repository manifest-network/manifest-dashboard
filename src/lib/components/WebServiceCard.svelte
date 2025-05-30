<script lang="ts">
  import {formatLargeNumber, formatNumber, formatRoundNumber} from "$lib/utils/format";

  const {totalWebServer, totalRequestPerSec, totalRequests} = $props<{
    totalWebServer: string
    totalRequestPerSec: string
    totalRequests: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Web Services</h2>
    <a href="/web-services-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalWebServer)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Web Servers</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatRoundNumber(totalRequestPerSec, 2)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Requests/Sec</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalRequests, 2)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Requests</p>
    </div>
  </div>
</div>
