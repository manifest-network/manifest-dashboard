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
  import type {PartialCumsumMetric} from "$lib/schemas/cumsumMetrics";
  import NetworkCard from "$lib/components/NetworkCard.svelte";

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


  const metrics: PartialCommonMetric = $derived(data.latestMetric)
  const chainMetrics: PartialBetaChainMetric = $derived(data.latestChainMetric)
  const cumsumMetrics: PartialCumsumMetric = $derived(data.latestCumsumMetric);
  const geoData: GeoRecordArray = $derived(data.worldMap)
  const totalSupply: BigNumber = $derived(BigNumber(chainMetrics.manifest_tokenomics_total_supply))
  const excludedSupply: BigNumber = $derived(BigNumber(chainMetrics.manifest_tokenomics_excluded_supply))
  const circulatingSupply: BigNumber = $derived(totalSupply.minus(excludedSupply));

  // Convert the MANY PWR:MFX conversion rate to Manifest by dividing by the 1:10 split
  const pwrMfx: BigNumber = $derived(BigNumber(metrics.talib_mfx_power_conversion ?? "1").div(10));

  // Divide the total supply by the number of decimal places (6) to get the actual token amount
  const estimatedMarketCap: BigNumber = $derived(totalSupply.div(1_000_000).multipliedBy(pwrMfx));
  const uniqueCountries: number = $derived(
    new Set(geoData.map(item => item.country_name)).size
  );
</script>

<main>
  <div class="max-w-screen mx-auto p-4">
    <div class="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
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
              tokenSupply={totalSupply.toFixed() ?? "N/A"}
              totalMinted={chainMetrics.total_mfx_minted ?? "N/A"}
              totalBurned={chainMetrics.total_mfx_burned ?? "N/A"}
              pwrMfx={pwrMfx.toFixed()}
              marketCap={estimatedMarketCap ? estimatedMarketCap.toFixed() : "N/A"}
              circulatingSupply={circulatingSupply ? circulatingSupply.toFixed() : "N/A"}
              lockedTokens={chainMetrics.locked_tokens ?? "N/A"}
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
              totalRequests={cumsumMetrics.web_requests ?? "N/A"}
      />

      <DecentralizedWebHosting
              totalWebsites={metrics.web_sites ?? "N/A"}
              totalRequests={cumsumMetrics.decentralized_web_requests ?? "N/A"}
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

      <NetworkCard
        totalIpv4BandwidthReceived={cumsumMetrics.system_network_received ?? "N/A"}
        totalIpv4BandwidthSent={cumsumMetrics.system_network_sent ?? "N/A"}
        totalIpv4PacketReceived={cumsumMetrics.system_tcp_received ?? "N/A"}
        totalIpv4PacketSent={cumsumMetrics.system_tcp_sent ?? "N/A"}
      />
    </div>
  </div>
</main>
