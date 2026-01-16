<script lang="ts">
  import {Switch, Tooltip, Portal} from '@skeletonlabs/skeleton-svelte';
  import Light from 'carbon-icons-svelte/lib/Light.svelte';
  import AsleepFilled from 'carbon-icons-svelte/lib/AsleepFilled.svelte';
  import {theme} from '$lib/stores/theme.svelte';
</script>

{#if theme.initialized}
  <Tooltip>
    <Tooltip.Trigger>
      <Switch checked={!theme.isDark} onCheckedChange={() => theme.toggle()}>
        <Switch.Control>
          <Switch.Thumb>
            <Switch.Context>
              {#snippet children(switch_)}
                {#if switch_().checked}
                  <Light />
                {:else}
                  <AsleepFilled />
                {/if}
              {/snippet}
            </Switch.Context>
          </Switch.Thumb>
        </Switch.Control>
        <Switch.HiddenInput />
      </Switch>
    </Tooltip.Trigger>
    <Portal>
      <Tooltip.Positioner>
        <Tooltip.Content class="card preset-filled-primary-100-900 p-4">
          Toggle {theme.isDark ? "light" : "dark"} mode
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Portal>
  </Tooltip>
{/if}