<script lang="ts">
  const {value = "N/A", label = ""}: {value?: string | number; label?: string} = $props();
</script>

<div class="metric">
  <p class="value">{value}</p>
  <p class="label">{label}</p>
</div>
