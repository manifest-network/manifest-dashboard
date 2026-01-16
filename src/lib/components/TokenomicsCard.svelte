<script lang="ts">
  import {formatBaseDenom} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  interface TokenomicsData {
    tokenSupply: string;
    totalMinted: string;
    totalBurned: string;
    totalPwrMinted: string;
    totalPwrBurned: string;
    pwrMfx: string;
    marketCap: string;
    circulatingSupply: string;
    lockedTokens: string;
    lockedFees: string;
    fdv: string;
  }

  const {data}: {data: TokenomicsData} = $props();
</script>

<Card title="Tokenomics" href="/tokenomic-details?interval=1 year">
  <div class="grid grid-cols-3 gap-x-4 gap-y-2">
    <Metric value={formatBaseDenom(data.fdv)} label="(Estimated) Fully Diluted Valuation" />
    <Metric value={formatBaseDenom(data.marketCap)} label="(Estimated) Market Cap." />
    <Metric value={formatBaseDenom(data.circulatingSupply)} label="(Estimated) Circulating MFX Supply" />
    <Metric value={formatBaseDenom(data.tokenSupply)} label="Total MFX Supply" />
    <Metric value="2 B" label="Maximum MFX Supply" />
    <Metric value={formatBaseDenom(data.totalMinted)} label="Total MFX Minted" />
    <Metric value={formatBaseDenom(data.totalBurned)} label="Total MFX Burned" />
    <Metric value={formatBaseDenom(data.totalPwrMinted)} label="Total PWR Minted" />
    <Metric value={formatBaseDenom(data.totalPwrBurned)} label="Total PWR Burned" />
    <Metric value={data.pwrMfx} label="PWR:MFX Conversion Rate" />
    <Metric value="10" label="Alpha:Beta MFX Conversion Rate" />
    <Metric value={formatBaseDenom(data.lockedTokens)} label="Locked MFX (excl. fees)" />
    <Metric value={formatBaseDenom(data.lockedFees)} label="Locked MFX (fees)" />
  </div>
</Card>