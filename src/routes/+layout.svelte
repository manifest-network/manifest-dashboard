<script lang="ts">
  import '../app.css';
  import {mode} from '$lib/stores/theme';
  import {AppBar} from '@skeletonlabs/skeleton-svelte';
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import TimeIntervalSegment from "$lib/components/TimeIntervalSegment.svelte";
  import {page} from "$app/state";

  let isDark = $derived($mode === 'dark');
  let ready = $state(false);
  $effect(() => {
    return mode.subscribe(() => {
      ready = true;
    });
  });

  // Only display the TimeIntervalSegment on detail pages
  const isDetailPage = $derived(() => {
    return page.url.pathname.endsWith('details') || page.url.pathname.includes('details/');
  })

  let {children} = $props();
</script>

{#if ready}
  <div class="flex flex-col h-screen overflow-hidden">
    <AppBar>
      {#snippet lead()}
        <div class="relative">
          <a href="/" class="inline-block">
            <img src={isDark ? "/manifest_dark.svg" : "/manifest_light.svg"} alt="Logo" class="h-14"/>
          </a>
        </div>
      {/snippet}

      <TimeIntervalSegment display={isDetailPage()} />

      {#snippet trail()}
        <LightSwitch/>
      {/snippet}
    </AppBar>

    <div class="overflow-y-auto">
      {@render children?.()}
    </div>
  </div>
{/if}
