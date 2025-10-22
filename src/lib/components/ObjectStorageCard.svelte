<script lang="ts">
  import {formatBinaryUnit, formatNumber, formatLargeNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {totalObjects, totalBuckets, usedStorage} = $props<{
    totalObjects: string,
    totalBuckets: string
    usedStorage: string
  }>();
</script>

<Card title="Object Storage" href="/object-storage-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatLargeNumber(totalObjects)} label="Total Objects" />
    <Metric value={formatNumber(totalBuckets)} label="Total Buckets" />
    <Metric value={formatBinaryUnit(usedStorage, "B")} label="Used Storage" />
  </div>
</Card>
