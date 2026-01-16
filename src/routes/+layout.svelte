<script lang="ts">
  import '../app.css';
  import {theme} from '$lib/stores/theme.svelte';
  import {AppBar, Progress} from '@skeletonlabs/skeleton-svelte';
  import TimeIntervalSegment from "$lib/components/TimeIntervalSegment.svelte";
  import {page, navigating} from "$app/state";

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
  <!-- Navigation progress bar -->
  {#if navigating.to}
    <div class="fixed top-0 left-0 right-0 z-50">
      <Progress value={null}>
        <Progress.Track class="h-0.5 bg-transparent">
          <Progress.Range class="nav-progress-bar" />
        </Progress.Track>
      </Progress>
    </div>
  {/if}

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