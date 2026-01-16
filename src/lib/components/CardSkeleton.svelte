<script lang="ts">
  const {height = "200px"}: {height?: string} = $props();
</script>

<div class="card w-full h-full p-4 animate-pulse">
  <div class="flex items-center justify-center" style:height={height}>
    <div
      class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>
</div>
