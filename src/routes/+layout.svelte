<script lang="ts">
  import '../app.css';
  import {AppBar} from '@skeletonlabs/skeleton-svelte';
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import {mode} from '$lib/stores/theme';

  let isDark = $derived($mode === 'dark');
  let ready = $state(false);
  $effect(() => {
    return mode.subscribe(() => {
      ready = true;
    });
  });

  let {children} = $props();

  // const intervalOptions: { label: string; value: TimeScale }[] = [
  //   {label: '1 Year', value: '1 year'},
  //   {label: '3 Months', value: '3 months'},
  //   {label: '1 Month', value: '1 month'},
  //   {label: '1 Week', value: '1 week'},
  //   {label: '1 Day', value: '1 day'},
  //   {label: '1 Hour', value: '1 hour'},
  //   {label: '1 Minute', value: '1 minute'},
  // ];
  //
  // const defaultInterval: TimeSpan = '1 day'
  // let selectedInterval: TimeSpan | null = $state(null)
  //
  // $effect(() => {
  //   // Make sure the interval is set to a default value if not provided
  //   const urlInterval = page.url.searchParams.get('interval');
  //   if (!urlInterval) {
  //     goto(`${page.url.pathname}?interval=${defaultInterval}`, {replaceState: true});
  //   }
  //
  //   if (selectedInterval !== urlInterval) {
  //     selectedInterval = urlInterval as TimeSpan;
  //   }
  // });
  //
  // function onIntervalChange(newInterval: TimeSpan) {
  //   if (newInterval !== page.url.searchParams.get('interval')) {
  //     goto(`${page.url.pathname}?interval=${newInterval}`, {replaceState: false});
  //   }
  // }
</script>

{#if ready /*&& selectedInterval*/}
  <div class="flex flex-col h-screen overflow-hidden">
    <AppBar>
      <!--{#snippet trail()}-->
      <!--  <Segment value={selectedInterval} name="interval" onValueChange={(e) => onIntervalChange(e.value as TimeSpan)} indicatorBg="bg-primary-300-700"-->
      <!--           indicatorText="text-surface-900-100">-->
      <!--    {#each intervalOptions as option (option.value)}-->
      <!--      <Segment.Item value={option.value}>{option.label}</Segment.Item>-->
      <!--    {/each}-->
      <!--  </Segment>-->
      <!--{/snippet}-->
      {#snippet lead()}
        <div class="relative">
          <a href="/" class="inline-block">
            <img src={isDark ? "/manifest_dark.svg" : "/manifest_light.svg"} alt="Logo" class="h-14"/>
          </a>
        </div>
      {/snippet}

      {#snippet trail()}
        <LightSwitch/>
      {/snippet}
    </AppBar>

    <div class="overflow-y-auto">
      {@render children?.()}
    </div>
  </div>
{/if}