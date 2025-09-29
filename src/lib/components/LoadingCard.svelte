<script lang="ts">
  const {title} = $props<{
    title: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-xl font-bold">{title}</h2>
  </div>
  <div class="flex flex-col items-center justify-center space-x-2">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-solid border-secondary-500 border-t-transparent"
    >
    </div>
    <p class="text-muted-foreground">Loading...</p>
  </div>
</div>
