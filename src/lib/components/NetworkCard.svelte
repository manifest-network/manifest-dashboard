<script lang="ts">
  import {formatBinaryUnit, formatLargeNumber} from "$lib/utils/format";

  const {totalIpv4BandwidthSent, totalIpv4BandwidthReceived, totalIpv4PacketSent, totalIpv4PacketReceived} = $props<{
    totalIpv4BandwidthSent: string,
    totalIpv4BandwidthReceived: string,
    totalIpv4PacketSent: string,
    totalIpv4PacketReceived: string
  }>();
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Network</h2>
    <a href="/network-details?interval=1 day" class="text-sm text-primary-500 hover:underline">View
      Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalIpv4BandwidthReceived, "KB")}</p>
      <p class="text-sm font-semibold mb-3">Total IPv4 Bandwidth Received</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatBinaryUnit(totalIpv4BandwidthSent, "KB")}</p>
      <p class="text-sm font-semibold mb-3">Total IPv4 Bandwidth Sent</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatLargeNumber(totalIpv4PacketReceived)}</p>
      <p class="text-sm font-semibold mb-3">Total IPv4 Packets Received</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatLargeNumber(totalIpv4PacketSent)}</p>
      <p class="text-sm font-semibold mb-3">Total IPv4 Packets Sent</p>
    </div>
  </div>
</div>
