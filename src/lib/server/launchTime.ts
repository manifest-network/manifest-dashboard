import {LAUNCH_DATE} from "$env/static/private";

let cached: number | undefined;

/**
 * Mainnet launch time as epoch milliseconds, parsed from the `LAUNCH_DATE` env var.
 *
 * Call this **lazily** (at request time), never at module scope: SvelteKit's build
 * `analyse` step imports server modules and runs their top-level code with an inlined
 * (possibly empty) `$env/static/private`, so a module-scope call here would throw during
 * `vite build`. Invoked from within request handling (loaders / schema preprocessing),
 * the throw only fires at runtime.
 *
 * The parsed value is memoized. Throws on a malformed value so a misconfigured runtime
 * fails fast (clear 500) instead of silently breaking the offset / pre-launch logic.
 * Server-only (reads `$env/static/private`).
 */
export function getLaunchTime(): number {
  if (cached !== undefined) {
    return cached;
  }
  const launchTime = new Date(LAUNCH_DATE).getTime();
  if (Number.isNaN(launchTime)) {
    throw new Error(`Invalid LAUNCH_DATE: "${LAUNCH_DATE}"`);
  }
  cached = launchTime;
  return launchTime;
}
