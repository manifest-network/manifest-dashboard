<script lang="ts">
  import type {PageProps} from "../../.svelte-kit/types/src/routes/$types";
  import {BigNumber} from "bignumber.js";
  import TokenomicsCard from "$lib/components/TokenomicsCard.svelte";
  import DecentralizedNetworkCard from "$lib/components/DecentralizedNetworkCard.svelte";
  import MainnetCard from "$lib/components/MainnetCard.svelte";

  const {data}: PageProps = $props();

  const metrics = data.data.data;
  const pwrMfx = data.pwrMfx;
  const estimatedMarketCap = BigNumber(metrics.manifest_tokenomics_total_supply).multipliedBy(pwrMfx);
</script>

<main>
  <div class="max-w-screen mx-auto p-8">
    <div class="grid md:grid-cols-3 gap-8">
      <DecentralizedNetworkCard
              totalNodeCount={metrics.node_count}
              totalCpuCores={metrics.system_cpu_cores}
              totalSystemMemory={metrics.system_memory}
              totalDiskSpace={metrics.disk_space_total}
      />

      <TokenomicsCard
              tokenSupply={metrics.manifest_tokenomics_total_supply}
              totalMinted={metrics.total_mfx_minted_testnet}
              totalBurned={metrics.total_mfx_burned_testnet}
              pwrMfx={pwrMfx}
              marketCap={estimatedMarketCap}
      />

      <MainnetCard
              totalUniqueUser={metrics.total_unique_user_testnet}
              totalDao={metrics.total_unique_group_testnet}
              totalTxCount={metrics.total_tx_count_testnet}
              tokenCount={metrics.manifest_tokenomics_token_count}
      />
    </div>
  </div>
</main>
