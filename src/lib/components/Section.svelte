<script lang="ts">
  export let title = ''
  export let cols = 'grid-cols-12'          // override if needed
  export let gap = 'gap-6'                  // 24px rhythm
</script>

<section class="mb-8">
  <h3 class="section-title">{title}</h3>
  <div class={`grid ${cols} ${gap}`}>
    <slot />
  </div>
</section>
