import {LAUNCH_DATE} from "$env/static/private";

/**
 * Mainnet launch time as epoch milliseconds, parsed from the `LAUNCH_DATE` env var.
 *
 * Validates the value and throws on a malformed date, so a misconfigured environment
 * fails fast (loudly at boot / as a 500) instead of silently breaking the offset and
 * pre-launch-filtering logic that depends on it. Server-only (reads `$env/static/private`).
 */
export function getLaunchTime(): number {
  const launchTime = new Date(LAUNCH_DATE).getTime();
  if (Number.isNaN(launchTime)) {
    throw new Error(`Invalid LAUNCH_DATE: "${LAUNCH_DATE}"`);
  }
  return launchTime;
}
