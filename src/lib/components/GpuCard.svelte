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

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">AI</h2>
    <a href="/gpu-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalGpu)}</p>
      <p class="text-sm font-semibold mb-3">Total GPU</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalMemory, "B")}</p>
      <p class="text-sm font-semibold mb-3">Total Memory</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalNvidiaGpu)}</p>
      <p class="text-sm font-semibold mb-3">Total NVIDIA GPU</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalNvidiaMemory, "B")}</p>
      <p class="text-sm font-semibold mb-3">Total NVIDIA Memory</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalAmdGpu)}</p>
      <p class="text-sm font-semibold mb-3">Total AMD GPU</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalAmdMemory, "B")}</p>
      <p class="text-sm font-semibold mb-3">Total AMD Memory</p>
    </div>
  </div>
</div>
