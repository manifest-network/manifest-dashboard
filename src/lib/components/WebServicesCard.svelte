<script lang="ts">
  import {formatNumber} from "$lib/utils/format";

  const {totalWebsites} = $props<{
    totalWebsites: string
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Decentralized Websites</h2>
    <a href="/" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalWebsites)}</p>
      <p class="text-sm font-semibold mb-3">Total Websites</p>
    </div>
  </div>
</div>
