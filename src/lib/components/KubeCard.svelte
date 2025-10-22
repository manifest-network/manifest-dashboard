<script lang="ts">
  import {formatNumber, formatBinaryUnit} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {totalPods, totalNodes, totalMemory} = $props<{
    totalPods: string,
    totalNodes: string,
    totalMemory: string
  }>();
</script>

<Card title="Kubernetes" href="/kube-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(totalNodes)} label="Total K8 Nodes" />
    <Metric value={formatBinaryUnit(totalMemory, 'MB')} label="Total K8 Memory" />
    <Metric value={formatNumber(totalPods)} label="Total K8 Pods" />
  </div>
</Card>
