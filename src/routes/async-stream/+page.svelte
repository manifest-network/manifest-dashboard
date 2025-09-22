<script lang="ts">

import type {PageProps} from "./$types";
import {readable} from "svelte/store";
import {invalidateAll} from "$app/navigation";
import BlockchainCard from "$lib/components/BlockchainCard.svelte";
import ErrorCard from "$lib/components/ErrorCard.svelte";

const {data}: PageProps = $props();

const tick = readable(Date.now(), (set) => {
  const id = setInterval(() => set(Date.now()), 1000);
  return () => clearInterval(id);
});

$effect(() => {
  if ($tick) {
    invalidateAll();
  }
});

</script>

<main>
  <svelte:boundary>
    <BlockchainCard
            totalUniqueUser={await data.data.total_unique_user ?? "N/A"}
            totalDao={await data.data.total_unique_group ?? "N/A"}
            totalTxCount={await data.data.total_tx_count ?? "N/A"}
            tokenCount={await data.data.manifest_tokenomics_token_count ?? "N/A"}
            blockchainHeight={await data.data.blockchain_height ?? "N/A"}
    />

    {#snippet pending()}
      <p>loading...</p>
    {/snippet}

    {#snippet failed(error, reset)}
      <ErrorCard title="Blockchain Data" error={"An error occurred while fetching blockchain data."}/>
    {/snippet}

  </svelte:boundary>
</main>
