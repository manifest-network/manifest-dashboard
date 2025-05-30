<script lang="ts">
  import {Infinity} from "carbon-icons-svelte";
  import {formatBaseDenom, formatCurrency, formatLargeNumber} from "$lib/utils/format";

  const {
    tokenSupply,
    totalMinted,
    totalBurned,
    pwrMfx,
    marketCap
  } = $props<{
    tokenSupply: string,
    totalMinted: string,
    totalBurned: string,
    pwrMfx: string,
    marketCap: string
  }>();

</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">Tokenomics</h2>
    <a href="/tokenomic-details?interval=1 day" class="text-xs text-primary-500 hover:underline">View Details</a>
  </div>
  <div class="grid grid-cols-2 gap-x-4 gap-y-2">
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatCurrency(marketCap)}</p>
      <p class="text-xs font-medium text-muted-foreground">(Estimated) Fully Diluted Valuation</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">TBD</p>
      <p class="text-xs font-medium text-muted-foreground">(Estimated) Circulating MFX Supply</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBaseDenom(tokenSupply)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total MFX Supply</p>
    </div>
    <div>
      <p class="text-secondary-400-600">
        <Infinity class="w-12 h-12"/>
      </p>
      <p class="text-xs font-medium text-muted-foreground">Maximum MFX Supply</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBaseDenom(totalMinted)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total MFX Minted</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{formatBaseDenom(totalBurned)}</p>
      <p class="text-xs font-medium text-muted-foreground">Total MFX Burned</p>
    </div>
    <div>
      <p class="text-xl font-bold text-secondary-400-600">{pwrMfx}</p>
      <p class="text-xs font-medium text-muted-foreground">PRW:MFX Conversion Rate</p>
    </div>
  </div>
</div>