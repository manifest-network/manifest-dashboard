<script lang="ts">
  import {formatBinaryUnit, formatLargeNumber, formatNumber, formatRoundNumber} from "$lib/utils/format";

  const {totalUniqueCountries, totalNodeCount, totalCpuCores, totalSystemMemory, totalDiskSpace, totalProcess, usedDiskSpace, usedSystemMemory} = $props<{
    totalUniqueCountries: string,
    totalNodeCount: string,
    totalCpuCores: string,
    totalSystemMemory: string,
    totalDiskSpace: string,
    totalProcess: string
    usedDiskSpace: string
    usedSystemMemory: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-bold">Decentralized Network</h2>
    <a href="/decentralized-network-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalUniqueCountries)}</p>
      <p class="text-xs font-medium text-muted-foreground">Countries</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatRoundNumber(totalNodeCount)}</p>
      <p class="text-xs font-medium text-muted-foreground">Nodes</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatRoundNumber(totalCpuCores)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total CPU Cores</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalProcess)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Processes</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalSystemMemory, "MB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total System Memory</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(usedSystemMemory, "MB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Used System Memory</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalDiskSpace, "GB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Disk Space</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(usedDiskSpace, "GB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Used Disk Space</p>
    </div>
  </div>
</div>
