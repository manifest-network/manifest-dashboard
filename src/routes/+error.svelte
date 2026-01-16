<script lang="ts">
  import {page} from '$app/state';
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
  <h1 class="text-6xl font-bold text-error-500">{page.status}</h1>
  <p class="mt-4 text-xl text-surface-600-400">
    {page.error?.message || 'An unexpected error occurred'}
  </p>
  <a
    href="/"
    class="mt-8 btn preset-filled-primary-500"
  >
    Return to Dashboard
  </a>
</div>
