<script lang="ts">
  export let title = ''
  export let href: string | undefined
</script>

<div class="card-preset p-4 h-full">
  <div class="flex items-center justify-between mb-2">
    <h2 class="card-title">{title}</h2>
    {#if href}
      <a class="cta text-xs" href={href}>View Details</a>
    {/if}
  </div>
  <slot />
</div>
