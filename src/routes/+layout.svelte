<script lang="ts">
  import '../app.css';
  import {theme} from '$lib/stores/theme.svelte';
  import {AppBar} from '@skeletonlabs/skeleton-svelte';
  import TimeIntervalSegment from "$lib/components/TimeIntervalSegment.svelte";
  import {page} from "$app/state";

  // Initialize theme on client mount
  $effect(() => {
    theme.init();
  });

  // Only display the TimeIntervalSegment on detail pages
  const isDetailPage = $derived(
    page.url.pathname.endsWith('details') || page.url.pathname.includes('details/')
  );

  let {children} = $props();
</script>

{#if theme.initialized}
  <div class="flex flex-col h-screen overflow-hidden">
    <AppBar>
      <AppBar.Toolbar class="grid-cols-[auto_auto_auto]">
       <AppBar.Lead>
          <div class="relative">
            <a href="/" class="inline-block">
              <img src={theme.isDark ? "/manifest_dark.svg" : "/manifest_light.svg"} alt="Logo" fetchpriority="high" />
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