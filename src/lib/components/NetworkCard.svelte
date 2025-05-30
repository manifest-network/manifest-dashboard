<script lang="ts">
  import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

  const {totalIpv4BandwidthSent, totalIpv4BandwidthReceived, totalIpv4PacketSent, totalIpv4PacketReceived} = $props<{
    totalIpv4BandwidthSent: string,
    totalIpv4BandwidthReceived: string,
    totalIpv4PacketSent: string,
    totalIpv4PacketReceived: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Network</h2>
    <a href="/network-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalIpv4BandwidthReceived, "KB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total IPv4 Bandwidth Received</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBinaryUnit(totalIpv4BandwidthSent, "KB")}</p>
      <p class="text-xs font-medium text-muted-foreground">Total IPv4 Bandwidth Sent</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalIpv4PacketReceived)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total IPv4 Packets Received</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatLargeNumber(totalIpv4PacketSent)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total IPv4 Packets Sent</p>
    </div>
  </div>
</div>
