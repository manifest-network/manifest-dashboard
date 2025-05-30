<script lang="ts">
  import {formatBinaryUnit, formatNumber} from "$lib/utils/format";

  const {totalGpu, totalMemory, totalNvidiaGpu, totalAmdGpu, totalNvidiaMemory, totalAmdMemory} = $props<{
    totalGpu: string
    totalMemory: string
    totalNvidiaGpu: string
    totalAmdGpu: string
    totalNvidiaMemory: string
    totalAmdMemory: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-bold tracking-tight">AI</h2>
    <a href="/gpu-details?interval=1 day" class="text-xs text-primary-500 hover:underline whitespace-nowrap">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalGpu)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total GPU</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalMemory, "B")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Memory</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalNvidiaGpu)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total NVIDIA GPU</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalNvidiaMemory, "B")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total NVIDIA Memory</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalAmdGpu)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total AMD GPU</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalAmdMemory, "B")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total AMD Memory</p>
    </div>
  </div>
</div>
