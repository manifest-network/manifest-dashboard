<script lang="ts">
  export let value: string | number
  export let label = ''
</script>

<div class="metric">
  <p class="value">{value}</p>
  <p class="label">{label}</p>
</div>
