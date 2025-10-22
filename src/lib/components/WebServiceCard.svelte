<script lang="ts">
  import {formatLargeNumber, formatNumber, formatRoundNumber} from "$lib/utils/format";
  import Metric from "$lib/components/Metric.svelte";
  import Card from "$lib/components/Card.svelte";

  const {totalWebServer, totalRequestPerSec, totalRequests} = $props<{
    totalWebServer: string
    totalRequestPerSec: string
    totalRequests: string
  }>();
</script>

<Card title="Web Services" href="/web-services-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatNumber(totalWebServer)} label="Total Web Servers" />
    <Metric value={formatRoundNumber(totalRequestPerSec, 2)} label="Total Requests/Sec" />
    <Metric value={formatLargeNumber(totalRequests, 2)} label="Total Requests" />
  </div>
</Card>
