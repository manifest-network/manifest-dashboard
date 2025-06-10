<script lang="ts">
  const {title, error} = $props<{
    title: string
    error: string
  }>();
</script>

<div class="card border-l-2 border-primary-200-800 pl-3 hover:shadow-md hover:border-secondary-500 transition preset-filled-surface-100-900 p-4">
  <div class="flex justify-between items-center mb-2">
    <h2 class="text-2xl font-bold">{title}</h2>
  </div>
  <div>
    <p class="text-xl font-bold text-error-400-600">{error}</p>
  </div>
</div>
