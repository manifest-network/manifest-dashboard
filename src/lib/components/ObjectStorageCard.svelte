<script lang="ts">
  import {formatBinaryUnit, formatNumber, formatLargeNumber} from "$lib/utils/format";

  const {totalObjects, totalBuckets, usedStorage} = $props<{
    totalObjects: string,
    totalBuckets: string
    usedStorage: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Object Storage</h2>
    <a href="/object-storage-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalObjects)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Objects</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatNumber(totalBuckets)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total Buckets</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(usedStorage, "B")}</p>
      <p class="text-xs font-medium text-muted-foreground">Used Storage </p>
    </div>
  </div>
</div>
