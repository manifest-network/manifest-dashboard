<script lang="ts">
  import type {PageProps} from "./$types";
  import {BigNumber} from "bignumber.js";
  import TokenomicsCard from "$lib/components/TokenomicsCard.svelte";
  import DecentralizedNetworkCard from "$lib/components/DecentralizedNetworkCard.svelte";
  import MainnetCard from "$lib/components/BlockchainCard.svelte";
  import WebServicesCard from "$lib/components/WebServicesCard.svelte";
  import KubeCard from "$lib/components/KubeCard.svelte";
  import ObjectStorageCard from "$lib/components/ObjectStorageCard.svelte";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import type {GeoRecordArray, Metrics} from "$lib/schemas";

  const {data}: PageProps = $props();

  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), 10000);
    return () => clearInterval(id);
  });

  $effect(() => {
    if ($tick) {
      invalidateAll();
    }
  });


  const metrics: Metrics = $derived(data.data.latestMetric.data)
  const geoData: GeoRecordArray = $derived(data.data.worldMap)
  const totalSupply: BigNumber = $derived(BigNumber(data.data.latestTotalSupply.data).dividedBy(1e6))
  const pwrMfx: string = $derived(data.pwrMfx);
  const estimatedMarketCap: BigNumber = $derived(BigNumber(totalSupply).multipliedBy(pwrMfx));
  const uniqueCountries: number = $derived(
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
              tokenSupply={totalSupply ?? "N/A"}
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
