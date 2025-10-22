<script lang="ts">
  import {formatBinaryUnit, formatLargeNumber, formatNumber, formatRoundNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

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

<Card title="Decentralized Network" href="/decentralized-network-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(totalUniqueCountries)} label="Countries" />
    <Metric value={formatRoundNumber(totalNodeCount)} label="Nodes" />
    <Metric value={formatRoundNumber(totalCpuCores)} label="Total CPU Cores" />
    <Metric value={formatLargeNumber(totalProcess)} label="Total Processes" />
    <Metric value={formatBinaryUnit(totalSystemMemory, "MB")} label="Total System Memory" />
    <Metric value={formatBinaryUnit(usedSystemMemory, "MB")} label="Used System Memory" />
    <Metric value={formatBinaryUnit(totalDiskSpace, "GB")} label="Total Disk Space" />
    <Metric value={formatBinaryUnit(usedDiskSpace, "GB")} label="Used Disk Space" />
  </div>
</Card>
