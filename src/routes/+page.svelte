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
  import GpuCard from "$lib/components/GpuCard.svelte";
  import WebServiceCard from "$lib/components/WebServiceCard.svelte";
  import type {PartialCommonMetric} from "$lib/schemas/commonMetrics";
  import type {PartialBetaChainMetric} from "$lib/schemas/betaChainMetrics";
  import type {GeoRecordArray} from "$lib/schemas/geo";

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


  const metrics: PartialCommonMetric = $derived(data.data.latestMetric)
  const chainMetrics: PartialBetaChainMetric = $derived(data.data.latestChainMetric)
  const geoData: GeoRecordArray = $derived(data.data.worldMap)
  const totalSupply: string = $derived(chainMetrics.manifest_tokenomics_total_supply)
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
              totalMinted={chainMetrics.total_mfx_minted ?? "N/A"}
              totalBurned={chainMetrics.total_mfx_burned ?? "N/A"}
              pwrMfx={pwrMfx}
              marketCap={estimatedMarketCap ? estimatedMarketCap.toFixed() : "N/A"}
      />

      <BlockchainCard
              totalUniqueUser={chainMetrics.total_unique_user ?? "N/A"}
              totalDao={chainMetrics.total_unique_group ?? "N/A"}
              totalTxCount={chainMetrics.total_tx_count ?? "N/A"}
              tokenCount={chainMetrics.manifest_tokenomics_token_count ?? "N/A"}
              blockchainHeight={chainMetrics.blockchain_height ?? "N/A"}
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
