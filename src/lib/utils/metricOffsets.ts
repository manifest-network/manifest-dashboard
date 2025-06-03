import {bigNumberLike} from "$lib/schemas/common";

// This file contains offsets for specific metrics that are used to adjust the values displayed in charts.
// Any work performed on these metrics BEFORE the mainnet launch date should NOT be counted.
export const METRIC_OFFSETS: Partial<Record<string, string>> = {
  total_mfx_burned: bigNumberLike.parse("135304300855652060000"),
}