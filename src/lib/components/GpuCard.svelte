<script lang="ts">
  import {formatBinaryUnit, formatNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  interface GpuData {
    totalGpu: string;
    totalMemory: string;
    totalNvidiaGpu: string;
    totalAmdGpu: string;
    totalNvidiaMemory: string;
    totalAmdMemory: string;
  }

  const {data}: {data: GpuData} = $props();
</script>

<Card title="AI" href="/gpu-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(Number(data.totalGpu))} label="Total GPU" />
    <Metric value={formatBinaryUnit(data.totalMemory, "B")} label="Total GPU Memory" />
    <Metric value={formatNumber(Number(data.totalNvidiaGpu))} label="Total NVIDIA GPU" />
    <Metric value={formatBinaryUnit(data.totalNvidiaMemory, "B")} label="Total NVIDIA Memory" />
    <Metric value={formatNumber(Number(data.totalAmdGpu))} label="Total AMD GPU" />
    <Metric value={formatBinaryUnit(data.totalAmdMemory, "B")} label="Total AMD Memory" />
  </div>
</Card>
