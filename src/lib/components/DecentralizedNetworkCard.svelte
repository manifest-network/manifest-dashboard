<script lang="ts">
  import {formatBinaryUnit, formatNumber} from "$lib/utils/format.js";

  const {totalUniqueCountries, totalNodeCount, totalCpuCores, totalSystemMemory, totalDiskSpace, totalGpu} = $props<{
    totalUniqueCountries: string,
    totalNodeCount: string,
    totalCpuCores: string,
    totalSystemMemory: string,
    totalDiskSpace: string,
    totalGpu: string,
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Decentralized Network</h2>
    <a href="/decentralized-network-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalUniqueCountries)}</p>
      <p class="text-sm font-semibold mb-3">Countries</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalNodeCount)}</p>
      <p class="text-sm font-semibold mb-3">Nodes</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalCpuCores)}</p>
      <p class="text-sm font-semibold mb-3">Total CPU Cores</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalSystemMemory, "MiB")}</p>
      <p class="text-sm font-semibold mb-3">Total System Memory</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalDiskSpace, "GiB")}</p>
      <p class="text-sm font-semibold mb-3">Total Disk Space</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{totalGpu}</p>
      <p class="text-sm font-semibold mb-3">Total GPU</p>
    </div>
  </div>
</div>
