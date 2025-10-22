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
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import Section from "$lib/components/Section.svelte";

  const {data}: PageProps = $props();

  const tick = readable(Date.now(), (set) => {
    const id = setInterval(() => set(Date.now()), 60000);
    return () => clearInterval(id);
  });

  $effect(() => {
    if ($tick) {
      invalidateAll();
    }
  });


  const metrics: PartialCommonMetric = $derived(data.latestMetric)
  const metricsError = $derived(data.latestMetricError)
  const chainMetrics: PartialBetaChainMetric = $derived(data.latestChainMetric)
  const chainMetricsError = $derived(data.latestChainMetricError);
  const cumsumMetrics: PartialCumsumMetric = $derived(data.latestCumsumMetric);
  const cumsumMetricsError = $derived(data.latestCumsumMetricError);
  const geoData: GeoRecordArray = $derived(data.worldMap)
  const geoDataError = $derived(data.worldMapError);
  const tokenMetrics = $derived(data.latestTokenMetric);
  const tokenMetricsError = $derived(data.latestTokenMetricError);

  const uniqueCountries: number = $derived(
    new Set(geoData.map(item => item?.country_name).filter(Boolean)).size
  );
</script>


<main>
  <div class="max-w-screen mx-auto p-4">
    <!-- INFRASTRUCTURE -->
    <Section title="Infrastructure" cols="grid-cols-12">
      <!-- Decentralized Network -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError || geoDataError}
          <ErrorCard title="Decentralized Network" error={metricsError ?? geoDataError}/>
        {:else}
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
        {/if}
      </div>

      <!-- AI (GPU) -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError}
          <ErrorCard title="AI" error={metricsError}/>
        {:else}
          <GpuCard
            totalGpu={metrics.gpu_total ?? "N/A"}
            totalMemory={metrics.gpu_memory ?? "N/A"}
            totalNvidiaGpu={metrics.gpu_nvidia_total ?? "N/A"}
            totalAmdGpu={metrics.gpu_amd_total ?? "N/A"}
            totalNvidiaMemory={metrics.gpu_nvidia_memory ?? "N/A"}
            totalAmdMemory={metrics.gpu_amd_memory ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Web Services -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError || cumsumMetricsError}
          <ErrorCard title="Web Services" error={metricsError ?? cumsumMetricsError}/>
        {:else}
          <WebServiceCard
            totalWebServer={metrics.web_servers ?? "N/A"}
            totalRequestPerSec={metrics.web_requests_per_sec ?? "N/A"}
            totalRequests={cumsumMetrics.web_requests ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Decentralized Websites -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError || cumsumMetricsError}
          <ErrorCard title="Decentralized Web Hosting" error={metricsError ?? cumsumMetricsError}/>
        {:else}
          <DecentralizedWebHosting
            totalWebsites={metrics.web_sites ?? "N/A"}
            totalRequests={cumsumMetrics.decentralized_web_requests ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Kubernetes -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError}
          <ErrorCard title="Kubernetes Metrics" error={metricsError}/>
        {:else}
          <KubeCard
            totalNodes={metrics.kube_nodes ?? "N/A"}
            totalPods={metrics.kube_pods ?? "N/A"}
            totalMemory={metrics.kube_memory ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Object Storage -->
      <div class="col-span-12 md:col-span-6 xl:col-span-3 h-full">
        {#if metricsError}
          <ErrorCard title="Object Storage" error={metricsError}/>
        {:else}
          <ObjectStorageCard
            totalBuckets={metrics.minio_buckets ?? "N/A"}
            totalObjects={metrics.minio_total ?? "N/A"}
            usedStorage={metrics.minio_used ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Network -->
      <div class="col-span-12 md:col-span-6 xl:col-span-6 h-full">
        {#if cumsumMetricsError}
          <ErrorCard title="Network Metrics" error={cumsumMetricsError}/>
        {:else}
          <NetworkCard
            totalIpv4BandwidthReceived={cumsumMetrics.system_network_received ?? "N/A"}
            totalIpv4BandwidthSent={cumsumMetrics.system_network_sent ?? "N/A"}
            totalIpv4PacketReceived={cumsumMetrics.system_tcp_received ?? "N/A"}
            totalIpv4PacketSent={cumsumMetrics.system_tcp_sent ?? "N/A"}
          />
        {/if}
      </div>
    </Section>

    <!-- ECONOMY -->
    <Section title="Economy" cols="grid-cols-12">
      <!-- Tokenomics -->
      <div class="col-span-12 md:col-span-6 xl:col-span-6 h-full">
        {#if chainMetricsError || metricsError || tokenMetricsError}
          <ErrorCard title="Tokenomics" error={chainMetricsError ?? metricsError ?? tokenMetricsError}/>
        {:else}
          <TokenomicsCard
            tokenSupply={chainMetrics.manifest_tokenomics_total_supply ?? "N/A"}
            totalMinted={chainMetrics.total_mfx_minted ?? "N/A"}
            totalBurned={chainMetrics.total_mfx_burned ?? "N/A"}
            totalPwrMinted={chainMetrics.total_pwr_minted ?? "N/A"}
            totalPwrBurned={chainMetrics.total_pwr_burned ?? "N/A"}
            pwrMfx={metrics.talib_mfx_power_conversion ? BigNumber(metrics.talib_mfx_power_conversion).div(10).toFixed() : "N/A"}
            marketCap={tokenMetrics.market_cap ?? "N/A"}
            circulatingSupply={tokenMetrics.circulating_supply ?? "N/A"}
            lockedTokens={chainMetrics.locked_tokens ?? "N/A"}
            lockedFees={chainMetrics.locked_fees ?? "N/A"}
            fdv={tokenMetrics.fdv ?? "N/A"}
          />
        {/if}
      </div>

      <!-- Blockchain -->
      <div class="col-span-12 md:col-span-6 xl:col-span-6 h-full">
        {#if chainMetricsError}
          <ErrorCard title="Blockchain Metrics" error={chainMetricsError}/>
        {:else}
          <BlockchainCard
            totalUniqueUser={chainMetrics.total_unique_user ?? "N/A"}
            totalDao={chainMetrics.total_unique_group ?? "N/A"}
            totalTxCount={chainMetrics.total_tx_count ?? "N/A"}
            tokenCount={chainMetrics.manifest_tokenomics_token_count ?? "N/A"}
            blockchainHeight={chainMetrics.blockchain_height ?? "N/A"}
          />
        {/if}
      </div>
    </Section>
  </div>
</main>
