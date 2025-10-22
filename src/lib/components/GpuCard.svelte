<script lang="ts">
  import {formatBinaryUnit, formatNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {totalGpu, totalMemory, totalNvidiaGpu, totalAmdGpu, totalNvidiaMemory, totalAmdMemory} = $props<{
    totalGpu: string
    totalMemory: string
    totalNvidiaGpu: string
    totalAmdGpu: string
    totalNvidiaMemory: string
    totalAmdMemory: string
  }>();
</script>

<Card title="AI" href="/gpu-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(totalGpu)} label="Total GPU" />
    <Metric value={formatBinaryUnit(totalMemory, "B")} label="Total GPU Memory" />
    <Metric value={formatNumber(totalNvidiaGpu)} label="Total NVIDIA GPU" />
    <Metric value={formatBinaryUnit(totalNvidiaMemory, "B")} label="Total NVIDIA Memory" />
    <Metric value={formatNumber(totalAmdGpu)} label="Total AMD GPU" />
    <Metric value={formatBinaryUnit(totalAmdMemory, "B")} label="Total AMD Memory" />
  </div>
</Card>
