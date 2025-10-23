<script lang="ts">
  const {title, error} = $props<{
    title: string
    error: string
  }>();
</script>

<div class="card p-4 card-preset">
  <div class="flex justify-between items-center mb-2">
    <h2 class="card-title">{title}</h2>
  </div>
  <div>
    <p class="text-xl font-bold text-error-400-600">{error}</p>
  </div>
</div>
