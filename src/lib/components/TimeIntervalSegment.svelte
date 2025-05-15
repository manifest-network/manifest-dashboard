<script lang="ts">
  import {page} from "$app/state";
  import {goto} from "$app/navigation";
  import {Segment} from "@skeletonlabs/skeleton-svelte";

  const intervalOptions: { label: string; value: TimeScale }[] = [
    {label: '1 Year', value: '1 year'},
    {label: '3 Months', value: '3 months'},
    {label: '1 Month', value: '1 month'},
    {label: '1 Week', value: '1 week'},
    {label: '1 Day', value: '1 day'},
    {label: '1 Hour', value: '1 hour'},
  ];

  const defaultInterval: TimeSpan = '1 day'
  let selectedInterval: TimeSpan | null = $state(null)

  // Get the display prop from the parent component
  const {display} = $props<boolean>();

  $effect(() => {
    // Only apply the interval change if we are on a detail page
    if (!display) {
      return;
    }

    // Make sure the interval is set to a default value if not provided
    const urlInterval = page.url.searchParams.get('interval');
    if (!urlInterval) {
      const params = new URLSearchParams(page.url.searchParams);
      params.set('interval', defaultInterval);
      goto(`${page.url.pathname}?${params.toString()}`, {replaceState: true});
    }

    if (selectedInterval !== urlInterval) {
      selectedInterval = urlInterval as TimeSpan;
    }
  });

  function onIntervalChange(newInterval: TimeSpan) {
    if (newInterval !== page.url.searchParams.get('interval')) {
      const params = new URLSearchParams(page.url.searchParams);
      params.set('interval', newInterval);
      goto(`${page.url.pathname}?${params.toString()}`, {keepFocus: true, replaceState: true});
    }
  }
</script>

{#if display && selectedInterval}
  <Segment value={selectedInterval}
           name="interval"
           onValueChange={(e) => onIntervalChange(e.value as TimeSpan)}
           indicatorBg="bg-primary-300-700"
           indicatorText="text-surface-900-100">
    {#each intervalOptions as option (option.value)}
      <Segment.Item value={option.value}>{option.label}</Segment.Item>
    {/each}
  </Segment>
{/if}