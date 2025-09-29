<script lang="ts">
  import type {PageProps} from "./$types";
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
  import NetworkCard from "$lib/components/NetworkCard.svelte";
  import ErrorCard from "$lib/components/ErrorCard.svelte";
  import LoadingCard from "$lib/components/LoadingCard.svelte";

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
</script>

<main>
  <div class="max-w-screen mx-auto p-4">
    <div class="grid md:grid-cols-3 xl:grid-cols-4 gap-4">

      <svelte:boundary>
        <DecentralizedNetworkCard
                totalUniqueCountries={new Set((await data.worldMap).map(item => item?.country_name).filter(Boolean)).size.toFixed() ?? "N/A"}
                totalNodeCount={(await data.latestMetric).node_count ?? "N/A"}
                totalCpuCores={(await data.latestMetric).system_cpu_cores ?? "N/A"}
                totalSystemMemory={(await data.latestMetric).system_memory ?? "N/A"}
                totalDiskSpace={(await data.latestMetric).disk_space_total ?? "N/A"}
                totalProcess={(await data.latestMetric).total_process ?? "N/A"}
                usedDiskSpace={(await data.latestMetric).disk_space_used ?? "N/A"}
                usedSystemMemory={(await data.latestMetric).system_memory_used ?? "N/A"}
        />
        {#snippet failed(error, reset)}
          <ErrorCard title="Decentralized Network" error={"An error occurred while fetching decentralized network data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Decentralized Network" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <GpuCard
                  totalGpu={(await data.latestMetric).gpu_total ?? "N/A"}
                  totalMemory={(await data.latestMetric).gpu_memory ?? "N/A"}
                  totalNvidiaGpu={(await data.latestMetric).gpu_nvidia_total ?? "N/A"}
                  totalAmdGpu={(await data.latestMetric).gpu_amd_total ?? "N/A"}
                  totalNvidiaMemory={(await data.latestMetric).gpu_nvidia_memory ?? "N/A"}
                  totalAmdMemory={(await data.latestMetric).gpu_amd_memory ?? "N/A"}
          />

        {#snippet failed(error, reset)}
          <ErrorCard title="AI" error={"An error occurred while fetching AI data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="AI" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <TokenomicsCard
                  tokenSupply={(await data.latestChainMetric).manifest_tokenomics_total_supply ?? "N/A"}
                  totalMinted={(await data.latestChainMetric).total_mfx_minted ?? "N/A"}
                  totalBurned={(await data.latestChainMetric).total_mfx_burned ?? "N/A"}
                  totalPwrMinted={(await data.latestChainMetric).total_pwr_minted ?? "N/A"}
                  totalPwrBurned={(await data.latestChainMetric).total_pwr_burned ?? "N/A"}
                  pwrMfx={(await data.latestMetric).talib_mfx_power_conversion}
                  marketCap={(await data.latestTokenMetric).market_cap ?? "N/A"}
                  circulatingSupply={(await data.latestTokenMetric).circulating_supply ?? "N/A"}
                  lockedTokens={(await data.latestChainMetric).locked_tokens ?? "N/A"}
                  lockedFees={(await data.latestChainMetric).locked_fees ?? "N/A"}
                  fdv={(await data.latestTokenMetric).fdv ?? "N/A"}
          />

        {#snippet failed(error, reset)}
          <ErrorCard title="Tokenomics" error={"An error occurred while fetching tokenomics data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Tokenomics" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
        <BlockchainCard
                totalUniqueUser={(await data.latestChainMetric).total_unique_user ?? "N/A"}
                totalDao={(await data.latestChainMetric).total_unique_group ?? "N/A"}
                totalTxCount={(await data.latestChainMetric).total_tx_count ?? "N/A"}
                tokenCount={(await data.latestChainMetric).manifest_tokenomics_token_count ?? "N/A"}
                blockchainHeight={(await data.latestChainMetric).blockchain_height ?? "N/A"}
        />

        {#snippet failed(error, reset)}
          <ErrorCard title="Blockchain Data" error={"An error occurred while fetching blockchain data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Blockchain Data" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <WebServiceCard
                  totalWebServer={(await data.latestMetric).web_servers ?? "N/A"}
                  totalRequestPerSec={(await data.latestMetric).web_requests_per_sec ?? "N/A"}
                  totalRequests={(await data.latestCumsumMetric).web_requests ?? "N/A"}
          />
        {#snippet failed(error, reset)}
          <ErrorCard title="Web Service" error={"An error occurred while fetching web service data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Web Service" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <DecentralizedWebHosting
                  totalWebsites={(await data.latestMetric).web_sites ?? "N/A"}
                  totalRequests={(await data.latestCumsumMetric).decentralized_web_requests ?? "N/A"}
          />
        {#snippet failed(error, reset)}
          <ErrorCard title="Decentralized Web" error={"An error occurred while fetching decentralized web data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Decentralized Web" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <KubeCard
                  totalNodes={(await data.latestMetric).kube_nodes ?? "N/A"}
                  totalPods={(await data.latestMetric).kube_pods ?? "N/A"}
                  totalMemory={(await data.latestMetric).kube_memory ?? "N/A"}
          />
        {#snippet failed(error, reset)}
          <ErrorCard title="Kubernetes" error={"An error occurred while fetching Kubernetes data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Kubernetes" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <ObjectStorageCard
                  totalBuckets={(await data.latestMetric).minio_buckets ?? "N/A"}
                  totalObjects={(await data.latestMetric).minio_total ?? "N/A"}
                  usedStorage={(await data.latestMetric).minio_used ?? "N/A"}
          />
        {#snippet failed(error, reset)}
          <ErrorCard title="Object Storage" error={"An error occurred while fetching object storage data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Object Storage" />
        {/snippet}
      </svelte:boundary>

      <svelte:boundary>
          <NetworkCard
                  totalIpv4BandwidthReceived={(await data.latestCumsumMetric).system_network_received ?? "N/A"}
                  totalIpv4BandwidthSent={(await data.latestCumsumMetric).system_network_sent ?? "N/A"}
                  totalIpv4PacketReceived={(await data.latestCumsumMetric).system_tcp_received ?? "N/A"}
                  totalIpv4PacketSent={(await data.latestCumsumMetric).system_tcp_sent ?? "N/A"}
          />
        {#snippet failed(error, reset)}
          <ErrorCard title="Network" error={"An error occurred while fetching network data."} />
          {@html (() => {
              console.error(error);
              setTimeout(() => reset(), 1000);
              return "";
          })()}
        {/snippet}

        {#snippet pending()}
          <LoadingCard title="Network" />
        {/snippet}
      </svelte:boundary>
    </div>
  </div>
</main>
