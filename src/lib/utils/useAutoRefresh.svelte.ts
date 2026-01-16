import {invalidate, invalidateAll} from "$app/navigation";

/**
 * Creates an auto-refresh effect that invalidates data at a specified interval.
 * Properly handles cleanup to prevent memory leaks.
 *
 * @param options - Configuration options
 * @param options.intervalMs - Refresh interval in milliseconds (default: 60000 = 1 minute)
 * @param options.key - Optional dependency key for targeted invalidation. If not provided, invalidates all.
 *
 * @example
 * // Invalidate all data every minute
 * useAutoRefresh();
 *
 * @example
 * // Invalidate specific data every 30 seconds
 * useAutoRefresh({ intervalMs: 30000, key: 'metrics:latest' });
 */
export function useAutoRefresh(options: { intervalMs?: number; key?: string } = {}) {
  const { intervalMs = 60000, key } = options;

  $effect(() => {
    const id = setInterval(() => {
      if (key) {
        invalidate(key);
      } else {
        invalidateAll();
      }
    }, intervalMs);

    return () => {
      clearInterval(id);
    };
  });
}
