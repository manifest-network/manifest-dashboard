<script lang="ts">
  import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";
  import Metric from "$lib/components/Metric.svelte";
  import Card from "$lib/components/Card.svelte";

  const {totalIpv4BandwidthSent, totalIpv4BandwidthReceived, totalIpv4PacketSent, totalIpv4PacketReceived} = $props<{
    totalIpv4BandwidthSent: string,
    totalIpv4BandwidthReceived: string,
    totalIpv4PacketSent: string,
    totalIpv4PacketReceived: string
  }>();
</script>

<Card title="Network" href="/network-details?interval=1 year">
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <Metric value={formatBinaryUnit(totalIpv4BandwidthReceived, "KB")} label="Total IPv4 Bandwidth Received" />
    <Metric value={formatBinaryUnit(totalIpv4BandwidthSent, "KB")} label="Total IPv4 Bandwidth Sent" />
    <Metric value={formatLargeNumber(totalIpv4PacketReceived)} label="Total IPv4 Packets Received" />
    <Metric value={formatLargeNumber(totalIpv4PacketSent)} label="Total IPv4 Packets Sent" />
  </div>
</Card>
