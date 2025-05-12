import {BigNumber} from "bignumber.js";

export function formatNumber(num: bigint | number): string {
  if (typeof num === 'bigint') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num.toLocaleString();
}

// Formats a value given in a specific binary unit (MiB or GiB) to a human-readable string, auto-scaling up to EiB.
export function formatBinaryUnit(value: number, unitBase: "MiB" | "GiB" = "MiB"): string {
  const units = ["MiB", "GiB", "TiB", "PiB", "EiB"];
  let index = unitBase === "MiB" ? 0 : 1;

  let remainder = new BigNumber(value);
  while (index < units.length - 1 && remainder.isGreaterThanOrEqualTo(1024)) {
    remainder = remainder.dividedBy(1024);
    index++;
  }
  return `${remainder.toFixed(2)} ${units[index]}`;
}

export function formatCurrency(value: string, currencySymbol: string = '$', decimalPlaces: number = 2): string {
  const bigNum = formatLargeNumber(value, decimalPlaces);
  if (bigNum === 'Error') return 'NaN';

  return `${currencySymbol}${bigNum}`;
}

export function formatLargeNumber(val: string, decimalPlaces: number = 2): string {
  const bigNum = BigNumber(val);
  if (bigNum.isNaN()) return 'NaN';

  const isNegative = bigNum.isLessThan(0);
  const absolute = bigNum.abs();

  let ret = "";

  if (absolute.isZero()) ret = BigNumber(0).toFixed(decimalPlaces);
  else if (absolute.isLessThan(1e3)) ret = absolute.toFixed(decimalPlaces);
  else if (absolute.isLessThan(1e6)) ret = `${absolute.dividedBy(1e3).toFixed(decimalPlaces)}K`;
  else if (absolute.isLessThan(1e9)) ret = `${absolute.dividedBy(1e6).toFixed(decimalPlaces)}M`;
  else if (absolute.isLessThan(1e12)) ret = `${absolute.dividedBy(1e9).toFixed(decimalPlaces)}B`;
  else if (absolute.isLessThan(1e15)) ret = `${absolute.dividedBy(1e12).toFixed(decimalPlaces)}T`;
  else if (absolute.isLessThan(1e18)) ret = `${absolute.dividedBy(1e15).toFixed(decimalPlaces)}Q`;
  else if (absolute.isLessThan(1e21)) ret = `${absolute.dividedBy(1e18).toFixed(decimalPlaces)}E`;
  else if (absolute.isLessThan(1e24)) ret = `${absolute.dividedBy(1e21).toFixed(decimalPlaces)}Z`;
  else if (absolute.isLessThan(1e27)) ret = `${absolute.dividedBy(1e24).toFixed(decimalPlaces)}Y`;
  else if (absolute.isLessThan(1e30)) ret = `${absolute.dividedBy(1e27).toFixed(decimalPlaces)}X`;
  else if (absolute.isLessThan(1e33)) ret = `${absolute.dividedBy(1e30).toFixed(decimalPlaces)}W`;

  return isNegative ? `-${ret}` : ret
}

