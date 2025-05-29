<script lang="ts">
  import {Switch, Tooltip} from '@skeletonlabs/skeleton-svelte';
  import Light from 'carbon-icons-svelte/lib/Light.svelte';
  import AsleepFilled from 'carbon-icons-svelte/lib/AsleepFilled.svelte';
  import {mode} from '$lib/stores/theme';

  let isDark = $derived($mode === 'dark');
  let ready = $state(false);

  $effect(() => {
    return mode.subscribe(() => {
      ready = true;
    });
  });

  $effect(() => {
    if (ready) {
      mode.set(isDark ? 'dark' : 'light');
    }
  });


</script>

{#if ready}
  <Tooltip
           triggerBase="underline"
           contentBase="card preset-filled-primary-100-900 p-4"
  >
    {#snippet trigger()}
      <Switch checked={!isDark} onCheckedChange={(e) => (isDark = !e.checked)}>
        {#snippet inactiveChild()}<AsleepFilled />{/snippet}
        {#snippet activeChild()}<Light />{/snippet}
      </Switch>
    {/snippet}
    {#snippet content()}Toggle {isDark ? "light" : "dark"} mode{/snippet}
  </Tooltip>
{/if}