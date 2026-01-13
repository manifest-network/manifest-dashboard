import {invalidateAll} from "$app/navigation";

/**
 * Creates an auto-refresh effect that calls invalidateAll() at a specified interval.
 * Properly handles cleanup to prevent memory leaks and race conditions.
 *
 * @param intervalMs - Refresh interval in milliseconds (default: 60000 = 1 minute)
 */
export function useAutoRefresh(intervalMs: number = 60000) {
  let isActive = $state(true);

  $effect(() => {
    // Reset active state when effect re-runs
    isActive = true;

    const id = setInterval(() => {
      if (isActive) {
        invalidateAll();
      }
    }, intervalMs);

    // Cleanup: stop interval and mark as inactive to prevent stale invalidations
    return () => {
      isActive = false;
      clearInterval(id);
    };
  });
}
