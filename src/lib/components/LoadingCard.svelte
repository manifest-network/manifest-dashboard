<script lang="ts">
  const {title} = $props<{
    title: string
  }>();
</script>

<div class="card-preset p-4 h-full">
  <div class="flex justify-between items-center mb-2">
    <h2 class="card-title">{title}</h2>
  </div>
  <div class="flex flex-col items-center justify-center space-x-2">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent"
    >
    </div>
    <p class="text-muted-foreground">Loading...</p>
  </div>
</div>
