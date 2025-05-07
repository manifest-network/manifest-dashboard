<script lang="ts">
  import { Infinity } from "carbon-icons-svelte";
  import type {PageProps} from "../../.svelte-kit/types/src/routes/$types";
  import {BigNumber} from "bignumber.js";

  const { data }: PageProps = $props();
  const tokenSupply = data.tokenSupply;
  const tokenCount = data.tokenCount;
  const tokenPrice = BigNumber(3.79);
  const estimatedMarketCap = BigNumber(data.tokenSupply).multipliedBy(tokenPrice);

  function formatNumber(num: bigint | number): string {
    if (typeof num === 'bigint') {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return num.toLocaleString();
  }

  function formatCurrency(value: BigNumber, currencySymbol: string = '$', decimalPlaces: number = 2): string {
    const fixedValue = value.toFixed(decimalPlaces);
    const parts = fixedValue.split('.');
    const integerPart = BigInt(parts[0]).toLocaleString(); // Use BigInt to handle large numbers for toLocaleString
    const decimalPart = parts[1];
    return `${currencySymbol}${integerPart}.${decimalPart}`;
  }
</script>

<main>
  <div class="max-w-screen mx-auto p-8">
    <div class="grid md:grid-cols-3 gap-8">
      <div class="card preset-filled-surface-100-900 p-8">

        <!-- Decentralized Network Section -->
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-bold">Decentralized Network</h2>
          <a href="/world" class="text-sm text-primary-500 hover:underline">View Details</a>
        </div>
            <div class="grid md:grid-cols-2 gap-8">
            <div>
              <p class="text-4xl font-bold text-secondary-400-600">152</p>
              <p class="text-sm font-semibold mb-3">Nodes</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-secondary-400-600">42</p>
              <p class="text-sm font-semibold mb-3">Wallets</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-secondary-400-600">51</p>
              <p class="text-sm font-semibold mb-3">DAO</p>
            </div>
          </div>
      </div>


      <!-- Tokenomic Section -->
      <div class="card preset-filled-surface-100-900 p-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-bold">Tokenomics</h2>
          <a href="/" class="text-sm text-primary-500 hover:underline">View Details</a>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <p class="text-4xl font-bold text-secondary-400-600">{formatCurrency(estimatedMarketCap)}</p>
            <p class="text-sm font-semibold mb-3">Estimated Fully Diluted Valuation</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-secondary-400-600">TBD</p>
            <p class="text-sm font-semibold mb-3">Estimated Circulating Supply</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(tokenSupply)} MFX</p>
            <p class="text-sm font-semibold mb-3">Total Supply</p>
          </div>
          <div>
            <p class="text-secondary-400-600"><Infinity class="w-12 h-12" /></p>
            <p class="text-sm font-semibold mb-3">Maximum Supply</p>
          </div>
        </div>
      </div>

      <!-- On-chain Denom Section -->
      <div class="card preset-filled-surface-100-900 p-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-2xl font-bold">On-chain Denominations</h2>
          <a href="/" class="text-sm text-primary-500 hover:underline">View Details</a>
        </div>
        <div>
          <p class="text-4xl font-bold text-secondary-400-600">{formatNumber(tokenCount)}</p>
          <p class="text-sm font-semibold mb-3">Unique Denominations</p>
        </div>
      </div>
    </div>
  </div>
</main>