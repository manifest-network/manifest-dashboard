// This record contains modifiers for specific metrics that are used to adjust the values displayed in charts.
import type {BigNumber} from "bignumber.js";

export const METRIC_MODIFIERS: Partial<Record<string, (value: BigNumber) => BigNumber>> = {
  fdv: (value) => value.div(10),
  market_cap: (value) => value.div(10),
}
