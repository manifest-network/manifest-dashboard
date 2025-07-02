import {ALLOWED_INTERVALS, getIntervalStartDate, IntervalMap, isValidTimeInterval} from "$lib/utils/time";
import {error} from "@sveltejs/kit";

/**
 * Extracts, validates, and prepares URL search parameters for the API call.
 * Throws SvelteKit errors for invalid parameters.
 * Returns a URLSearchParams object ready for the API request.
 */
export function extractAndPrepareTimeParams(url: URL): URLSearchParams | null {
  const interval = url.searchParams.get("interval");
  if (!interval) {
    return null
  }
  if (!isValidTimeInterval(interval)) {
    error(400, `Invalid interval parameter. Allowed values are: ${ALLOWED_INTERVALS.join(', ')}`);
  }

  const scale = IntervalMap[interval];
  const p_from = getIntervalStartDate(interval).toISOString();
  const p_to = new Date().toISOString();

  // Prepare validated parameters for API call
  return new URLSearchParams({
    order: 'timestamp.desc',
    p_interval: scale,
    p_from,
    p_to,
  });
}