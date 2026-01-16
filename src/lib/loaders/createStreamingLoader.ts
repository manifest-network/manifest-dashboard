import type {RequestEvent} from "@sveltejs/kit";
import type {ChartDataPoint} from "$lib/schemas/charts";

/**
 * Wraps a loader function to return a Promise<ChartResult> that never throws.
 * Errors are captured and returned as { data: null, error: message }.
 * This enables SvelteKit streaming without breaking on individual failures.
 */
export function createStreamingLoader<T, E extends RequestEvent = RequestEvent>(
  loader: (event: E) => Promise<{data: T}>
): (event: E) => Promise<ChartResult<T>> {
  return async (event): Promise<ChartResult<T>> => {
    try {
      const result = await loader(event);
      return {data: result.data, error: null};
    } catch (err) {
      let message = "Unknown error";
      if (err && typeof err === "object") {
        if ("body" in err && err.body && typeof err.body === "object" && "message" in err.body) {
          message = String((err.body as {message: unknown}).message);
        } else if (err instanceof Error) {
          message = err.message;
        }
      }
      return {data: null, error: message};
    }
  };
}

/**
 * Builds streaming tasks from chart configs.
 * Returns an object of Promises that SvelteKit will stream.
 */
export function buildStreamingTasks<E extends RequestEvent>(
  event: E,
  configs: ChartConfig[],
  getLoader: (config: ChartConfig) => (event: E) => Promise<{data: ChartDataPoint[]}>
): Record<string, Promise<ChartResult<ChartDataPoint[]>>> {
  return configs.reduce(
    (acc, config) => {
      const loader = getLoader(config);
      acc[config.id] = createStreamingLoader(loader)(event);
      return acc;
    },
    {} as Record<string, Promise<ChartResult<ChartDataPoint[]>>>
  );
}
