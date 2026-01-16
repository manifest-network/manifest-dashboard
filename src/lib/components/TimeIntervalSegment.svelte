<script lang="ts">
  import {page} from "$app/state";
  import {goto, preloadData} from "$app/navigation";
  import {SegmentedControl} from "@skeletonlabs/skeleton-svelte";

  const intervalOptions: { label: string; value: TimeScale }[] = [
    {label: '1 Year', value: '1 year'},
    {label: '3 Months', value: '3 months'},
    {label: '1 Month', value: '1 month'},
    {label: '1 Week', value: '1 week'},
    {label: '1 Day', value: '1 day'},
  ];

  const defaultInterval: TimeSpan = '1 year'
  let selectedInterval: TimeSpan | null = $state(null)

  // Get the display prop from the parent component
  const {display}: {display: boolean} = $props();

  const urlFor = (interval: TimeSpan) => {
    const params = new URLSearchParams(page.url.searchParams);
    params.set("interval", interval);
    return `${page.url.pathname}?${params.toString()}`;
  };

  let hoverTimer: number | null = null;

  // Preload data for the given interval after a short delay
  const preloadInterval = (interval: TimeSpan) => {
    if (!display) return;
    const href = urlFor(interval);
    // Skip if we're already on it
    if (href === `${page.url.pathname}?${page.url.searchParams.toString()}`) return;
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => {
      preloadData(href);
      hoverTimer = null;
    }, 80);
  };

  // Cleanup hover timer on component unmount
  $effect(() => {
    return () => clearTimeout(hoverTimer);
  });

  // URL parameter sync effect
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
      return; // Let the next effect tick sync back the selectedInterval
    }

    if (selectedInterval !== urlInterval) {
      selectedInterval = urlInterval as TimeSpan;
    }
  });

  function onIntervalChange(newInterval: TimeSpan) {
    const href = urlFor(newInterval);
    if (href !== `${page.url.pathname}?${page.url.searchParams.toString()}`) {
      goto(href, { keepFocus: true, replaceState: true });
    }
  }
</script>

{#if display && selectedInterval}
  <SegmentedControl value={selectedInterval}
         name="interval"
         orientation="horizontal"
         onValueChange={(e) => onIntervalChange(e.value as TimeSpan)}>
    <SegmentedControl.Control>
      <SegmentedControl.Indicator />
      {#each intervalOptions as option (option.value)}
        <SegmentedControl.Item
                value={option.value}
                onmouseenter={() => preloadInterval(option.value as TimeSpan)}
                onfocus={() => preloadInterval(option.value as TimeSpan)}
                onpointerenter={() => preloadInterval(option.value as TimeSpan)}
        >
          <SegmentedControl.ItemText>{option.value}</SegmentedControl.ItemText>
          <SegmentedControl.ItemHiddenInput />
        </SegmentedControl.Item>
      {/each}
    </SegmentedControl.Control>
  </SegmentedControl>
{/if}