<script lang="ts">
  import '../app.css';
  import {mode} from '$lib/stores/theme';
  import {AppBar} from '@skeletonlabs/skeleton-svelte';
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
  const isDetailPage = $derived(
    page.url.pathname.endsWith('details') || page.url.pathname.includes('details/')
  );

  let {children} = $props();
</script>

{#if ready}
  <div class="flex flex-col h-screen overflow-hidden">
    <AppBar>
      <AppBar.Toolbar class="grid-cols-[auto_auto_auto]">
       <AppBar.Lead>
          <div class="relative">
            <a href="/" class="inline-block">
              <img src={isDark ? "/manifest_dark.svg" : "/manifest_light.svg"} alt="Logo" fetchpriority="high" />
            </a>
          </div>
       </AppBar.Lead>

        <AppBar.Headline>
          <TimeIntervalSegment display={isDetailPage} />
        </AppBar.Headline>
      </AppBar.Toolbar>
    </AppBar>

    <div class="overflow-y-auto">
      {@render children?.()}
    </div>
  </div>
{/if}