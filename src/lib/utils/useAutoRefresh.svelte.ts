import {invalidateAll} from "$app/navigation";

/**
 * Creates an auto-refresh effect that calls invalidateAll() at a specified interval.
 * Properly handles cleanup to prevent memory leaks.
 *
 * @param intervalMs - Refresh interval in milliseconds (default: 60000 = 1 minute)
 */
export function useAutoRefresh(intervalMs: number = 60000) {
  $effect(() => {
    const id = setInterval(() => {
      invalidateAll();
    }, intervalMs);

    return () => {
      clearInterval(id);
    };
  });
}
