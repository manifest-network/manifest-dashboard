<script lang="ts">
  import type {Snippet} from "svelte";

  const {
    title = "",
    cols = "grid-cols-12",
    gap = "gap-6",
    children,
  }: {title?: string; cols?: string; gap?: string; children?: Snippet} = $props();
</script>

<section class="mb-8">
  <h3 class="section-title">{title}</h3>
  <div class={`grid ${cols} ${gap}`}>
    {@render children?.()}
  </div>
</section>
