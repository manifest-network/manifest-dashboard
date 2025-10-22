<script lang="ts">
  import {formatLargeNumber, formatNumber} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {totalWebsites, totalRequests} = $props<{
    totalWebsites: string
    totalRequests: string
  }>();
</script>

<Card title="Decentralized Websites" href="/decentralized-website-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(totalWebsites)} label="Total Websites" />
    <Metric value={formatLargeNumber(totalRequests)} label="Total Web Requests" />
  </div>
</Card>
