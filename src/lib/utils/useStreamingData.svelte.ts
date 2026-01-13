/**
 * A Svelte 5 runes-based helper for handling streamed data with stale-while-revalidate pattern.
 * Keeps old data visible during refresh, shows loading state only on initial load.
 *
 * @remarks Uses global `ChartResult<T>` type from `src/global.d.ts`
 */
export function useStreamingData<T>(getPromise: () => Promise<ChartResult<T>>) {
  let result = $state<ChartResult<T> | null>(null);
  let isRefreshing = $state(false);
  let isInitialLoad = $state(true);

  $effect(() => {
    const currentPromise = getPromise();
    if (!isInitialLoad) isRefreshing = true;

    // Track if this effect instance is still active to prevent stale updates
    let isActive = true;

    currentPromise
      .then((r) => {
        if (!isActive) return; // Ignore stale responses
        result = r;
        isRefreshing = false;
        isInitialLoad = false;
      })
      .catch((err) => {
        if (!isActive) return; // Ignore stale errors
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Unexpected error resolving streamed data:", err);
        result = {data: null, error: errorMessage};
        isRefreshing = false;
        isInitialLoad = false;
      });

    // Cleanup: mark this effect instance as stale when re-run or destroyed
    return () => {
      isActive = false;
    };
  });

  return {
    get result() {
      return result;
    },
    get data() {
      return result?.data ?? null;
    },
    get error() {
      return result?.error ?? null;
    },
    get isRefreshing() {
      return isRefreshing;
    },
    get isInitialLoad() {
      return isInitialLoad;
    },
  };
}
