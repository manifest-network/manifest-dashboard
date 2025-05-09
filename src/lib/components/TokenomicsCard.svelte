<script lang="ts">
  import {Infinity} from "carbon-icons-svelte";
  import {formatCurrency, formatNumber} from "$lib/utils/format";

  export let tokenSupply: bigint;
  export let totalMinted: number;
  export let totalBurned: number;
  export let pwrMfx: number;
  export let marketCap: number;
</script>

<div class="card preset-filled-surface-100-900 p-8">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-2xl font-bold">Tokenomics</h2>
    <a href="/" class="text-sm text-primary-500 hover:underline">View Details</a>
  </div>
  <div class="grid md:grid-cols-2 gap-8">
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatCurrency(marketCap)}</p>
      <p class="text-sm font-semibold mb-3">(Estimated) Fully Diluted Valuation</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">TBD</p>
      <p class="text-sm font-semibold mb-3">(Estimated) Circulating Supply</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(tokenSupply)}</p>
      <p class="text-sm font-semibold mb-3">Total Supply</p>
    </div>
    <div>
      <p class="text-secondary-400-600">
        <Infinity class="w-12 h-12"/>
      </p>
      <p class="text-sm font-semibold mb-3">Maximum Supply</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalMinted)}</p>
      <p class="text-sm font-semibold mb-3">Total Minted</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(totalBurned)}</p>
      <p class="text-sm font-semibold mb-3">Total Burned</p>
    </div>
    <div>
      <p class="text-4xl font-bold text-secondary-400-600">{pwrMfx}</p>
      <p class="text-sm font-semibold mb-3">PRW:MFX Conversion Rate</p>
    </div>
  </div>
</div>