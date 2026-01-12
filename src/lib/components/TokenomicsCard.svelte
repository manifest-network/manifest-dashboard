<script lang="ts">
  import {formatBaseDenom} from "$lib/utils/format";
  import Card from "$lib/components/Card.svelte";
  import Metric from "$lib/components/Metric.svelte";

  const {
    tokenSupply,
    totalMinted,
    totalBurned,
    totalPwrMinted,
    totalPwrBurned,
    pwrMfx,
    marketCap,
    circulatingSupply,
    lockedTokens,
    lockedFees,
    fdv,
  } = $props<{
    tokenSupply: string,
    totalMinted: string,
    totalBurned: string,
    totalPwrMinted: string,
    totalPwrBurned: string,
    pwrMfx: string,
    marketCap: string
    circulatingSupply: string
    lockedTokens: string
    lockedFees: string
    fdv: string
  }>();

</script>

<Card title="Tokenomics" href="/tokenomic-details?interval=1 year">
  <div class="grid grid-cols-3 gap-x-4 gap-y-2">
    <Metric value={formatBaseDenom(fdv)} label="(Estimated) Fully Diluted Valuation" />
    <Metric value={formatBaseDenom(marketCap)} label="(Estimated) Market Cap." />
    <Metric value={formatBaseDenom(circulatingSupply)} label="(Estimated) Circulating MFX Supply" />
    <Metric value={formatBaseDenom(tokenSupply)} label="Total MFX Supply" />
    <Metric value="2 B" label="Maximum MFX Supply" />
    <Metric value={formatBaseDenom(totalMinted)} label="Total MFX Minted" />
    <Metric value={formatBaseDenom(totalBurned)} label="Total MFX Burned" />
    <Metric value={formatBaseDenom(totalPwrMinted)} label="Total PWR Minted" />
    <Metric value={formatBaseDenom(totalPwrBurned)} label="Total PWR Burned" />
    <Metric value={pwrMfx} label="PWR:MFX Conversion Rate" />
    <Metric value="10" label="Alpha:Beta MFX Conversion Rate" />
    <Metric value={formatBaseDenom(lockedTokens)} label="Locked MFX (excl. fees)" />
    <Metric value={formatBaseDenom(lockedFees)} label="Locked MFX (fees)" />
  </div>
</Card>