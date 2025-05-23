<script lang="ts">
  import {formatBinaryUnit, formatNumber} from "$lib/utils/format";
  import {formatLargeNumber} from "$lib/utils/format.js";

  const {totalObjects, totalBuckets, usedStorage} = $props<{
    totalObjects: string,
    totalBuckets: string
    usedStorage: string
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Object Storage</h2>
    <a href="/object-storage-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatLargeNumber(totalObjects)}</p>
      <p class="text-sm font-semibold mb-3">Total Objects</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalBuckets)}</p>
      <p class="text-sm font-semibold mb-3">Total Buckets</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(usedStorage, "B")}</p>
      <p class="text-sm font-semibold mb-3">Used Storage </p>
    </div>
  </div>
</div>
