<script lang="ts">
  import {formatNumber, formatBinaryUnit} from "$lib/utils/format";

  const {totalPods, totalNodes, totalMemory} = $props<{
    totalPods: string,
    totalNodes: string,
    totalMemory: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Kubernetes</h2>
    <a href="/kube-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalNodes)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total K8 Nodes</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalMemory, 'MB')}</p>
      <p class="text-xs font-medium text-muted-foreground">Total K8 Memory</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalPods)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total K8 Pods</p>
    </div>
  </div>
</div>
