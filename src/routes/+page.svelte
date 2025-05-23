<script lang="ts">
  import type {PageProps} from "./$types";
  import {BigNumber} from "bignumber.js";
  import TokenomicsCard from "$lib/components/TokenomicsCard.svelte";
  import DecentralizedNetworkCard from "$lib/components/DecentralizedNetworkCard.svelte";
  import BlockchainCard from "$lib/components/BlockchainCard.svelte";
  import DecentralizedWebHosting from "$lib/components/DecentralizedWebHosting.svelte";
  import KubeCard from "$lib/components/KubeCard.svelte";
  import ObjectStorageCard from "$lib/components/ObjectStorageCard.svelte";
  import {readable} from "svelte/store";
  import {invalidateAll} from "$app/navigation";
  import type {GeoRecordArray, PartialMetrics} from "$lib/schemas";
  import GpuCard from "$lib/components/GpuCard.svelte";
  import WebServiceCard from "$lib/components/WebServiceCard.svelte";

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


  const metrics: PartialMetrics = $derived(data.data.latestMetric)
  const geoData: GeoRecordArray = $derived(data.data.worldMap)
  const totalSupply: string = $derived(data.data.latestTotalSupply)
  const pwrMfx: string = $derived(data.pwrMfx);
  const estimatedMarketCap: BigNumber = $derived(BigNumber(totalSupply).multipliedBy(pwrMfx));
  const uniqueCountries: number = $derived(
    new Set(geoData.map(item => item.country_name)).size
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
              totalProcess={metrics.total_process ?? "N/A"}
              usedDiskSpace={metrics.disk_space_used ?? "N/A"}
              usedSystemMemory={metrics.system_memory_used ?? "N/A"}
      />

      <GpuCard
              totalGpu={metrics.gpu_total ?? "N/A"}
              totalMemory={metrics.gpu_memory ?? "N/A"}
              totalNvidiaGpu={metrics.gpu_nvidia_total ?? "N/A"}
              totalAmdGpu={metrics.gpu_amd_total ?? "N/A"}
              totalNvidiaMemory={metrics.gpu_nvidia_memory ?? "N/A"}
              totalAmdMemory={metrics.gpu_amd_memory ?? "N/A"}
      />

      <TokenomicsCard
              tokenSupply={totalSupply ?? "N/A"}
              totalMinted={metrics.total_mfx_minted_testnet ?? "N/A"}
              totalBurned={metrics.total_mfx_burned_testnet ?? "N/A"}
              pwrMfx={pwrMfx}
              marketCap={estimatedMarketCap ? estimatedMarketCap.toFixed() : "N/A"}
      />

      <BlockchainCard
              totalUniqueUser={metrics.total_unique_user_testnet ?? "N/A"}
              totalDao={metrics.total_unique_group_testnet ?? "N/A"}
              totalTxCount={metrics.total_tx_count_testnet ?? "N/A"}
              tokenCount={metrics.manifest_tokenomics_token_count ?? "N/A"}
              blockchainHeight={metrics.blockchain_height_testnet ?? "N/A"}
      />

      <WebServiceCard
              totalWebServer={metrics.web_servers ?? "N/A"}
              totalRequestPerSec={metrics.web_requests_per_sec ?? "N/A"}
      />

      <DecentralizedWebHosting
              totalWebsites={metrics.web_sites ?? "N/A"}
      />

      <KubeCard
              totalNodes={metrics.kube_nodes ?? "N/A"}
              totalPods={metrics.kube_pods ?? "N/A"}
              totalMemory={metrics.kube_memory ?? "N/A"}
      />

      <ObjectStorageCard
              totalBuckets={metrics.minio_buckets ?? "N/A"}
              totalObjects={metrics.minio_total ?? "N/A"}
              usedStorage={metrics.minio_used ?? "N/A"}
      />
    </div>
  </div>
</main>
