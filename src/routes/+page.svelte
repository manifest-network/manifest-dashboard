<script lang="ts">
  import type {PageProps} from "./$types";
  import {BigNumber} from "bignumber.js";
  import TokenomicsCard from "$lib/components/TokenomicsCard.svelte";
  import DecentralizedNetworkCard from "$lib/components/DecentralizedNetworkCard.svelte";
  import MainnetCard from "$lib/components/MainnetCard.svelte";
  import WebServicesCard from "$lib/components/WebServicesCard.svelte";
  import KubeCard from "$lib/components/KubeCard.svelte";
  import ObjectStorageCard from "$lib/components/ObjectStorageCard.svelte";

  const {data}: PageProps = $props();
  const metrics = $derived(data.data.latestMetric.data)
  const geoData = $derived(data.data.worldMap)
  const pwrMfx = $derived(data.pwrMfx);
  const estimatedMarketCap = $derived(metrics && metrics.manifest_tokenomics_total_supply && BigNumber(metrics.manifest_tokenomics_total_supply).multipliedBy(pwrMfx));
  const uniqueCountries = $derived(
    new Set(geoData.geo.map(item => item.country_name)).size
  );
</script>

<main>
  <div class="max-w-screen mx-auto p-8">
    <div class="grid md:grid-cols-3 gap-8">
      <DecentralizedNetworkCard
              totalUniqueCountries={uniqueCountries.toFixed() ?? "N/A"}
              totalNodeCount={metrics.node_count ?? "N/A"}
              totalCpuCores={metrics.system_cpu_cores ?? "N/A"}
              totalSystemMemory={metrics.system_memory ?? "N/A"}
              totalDiskSpace={metrics.disk_space_total ?? "N/A"}
              totalGpu={metrics.gpu_total ?? "N/A"}
      />

      <TokenomicsCard
              tokenSupply={metrics.manifest_tokenomics_total_supply ?? "N/A"}
              totalMinted={metrics.total_mfx_minted_testnet ?? "N/A"}
              totalBurned={metrics.total_mfx_burned_testnet ?? "N/A"}
              pwrMfx={pwrMfx}
              marketCap={estimatedMarketCap ? estimatedMarketCap.toFixed() : "N/A"}
      />

      <MainnetCard
              totalUniqueUser={metrics.total_unique_user_testnet ?? "N/A"}
              totalDao={metrics.total_unique_group_testnet ?? "N/A"}
              totalTxCount={metrics.total_tx_count_testnet ?? "N/A"}
              tokenCount={metrics.manifest_tokenomics_token_count ?? "N/A"}
      />

      <WebServicesCard
              totalWebsites={metrics.web_sites ?? "N/A"}
      />

      <KubeCard
              totalNodes={metrics.kube_nodes ?? "N/A"}
              totalPods={metrics.kube_pods ?? "N/A"}
      />

      <ObjectStorageCard
              totalBuckets={metrics.minio_buckets ?? "N/A"}
              totalObjects={metrics.minio_total ?? "N/A"}
      />
    </div>
  </div>
</main>
