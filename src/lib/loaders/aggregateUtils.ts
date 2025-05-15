import {ALLOWED_INTERVALS, getIntervalStartDate, IntervalMap, isValidTimeInterval} from "$lib/utils/time";
import {error} from "@sveltejs/kit";

/**
 * Extracts, validates, and prepares URL search parameters for the API call.
 * Throws SvelteKit errors for invalid parameters.
 * Returns a URLSearchParams object ready for the API request.
 */
export function extractAndPrepareApiParams(url: URL): URLSearchParams | null {
  const interval = url.searchParams.get("interval");
  if (!interval) {
    return null
  }
  if (!isValidTimeInterval(interval)) {
    error(400, `Invalid interval parameter. Allowed values are: ${ALLOWED_INTERVALS.join(', ')}`);
  }

  const scale = IntervalMap[interval];
  const time_from = getIntervalStartDate(interval).toISOString();
  const time_to = new Date().toISOString();

  // Prepare validated parameters for API call
  return new URLSearchParams({
    order: 'timestamp.desc',
    interval_str: scale,
    time_from,
    time_to,
  });
}