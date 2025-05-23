<script lang="ts">
  import {formatNumber, formatRoundNumber} from "$lib/utils/format.js";

  const {totalWebServer, totalRequestPerSec} = $props<{
    totalWebServer: string
    totalRequestPerSec: string
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Web Services</h2>
    <a href="/web-services-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalWebServer)}</p>
      <p class="text-sm font-semibold mb-3">Total Web Servers</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatRoundNumber(totalRequestPerSec, 2)}</p>
      <p class="text-sm font-semibold mb-3">Total Requests/Sec</p>
    </div>
  </div>
</div>
