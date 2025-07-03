// This record contains offsets for specific metrics that are used to adjust the values displayed in charts.
// Any work performed on these metrics BEFORE the mainnet launch date should NOT be counted.
import {bigNumberLike} from "$lib/schemas/common";

export const METRIC_OFFSETS: Partial<Record<string, string>> = {
  burned_supply: bigNumberLike.parse("135304300855786304018"),
  locked_fees: bigNumberLike.parse("134244018"),
}
