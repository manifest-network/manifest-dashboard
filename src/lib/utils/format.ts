import {BigNumber} from "bignumber.js";

export function formatNumber(num: bigint | number): string {
  if (typeof num === 'bigint') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return num.toLocaleString();
}

// Formats a value given in a specific binary unit (MB or GB) to a human-readable string, auto-scaling up to EB.
export function formatBinaryUnit(value: string, unitBase: "B" | "KB" | "MB" | "GB" = "MB", decimalPlaces: number = 2): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
  let index = units.indexOf(unitBase);
  if (index === -1) index = units.indexOf("MB");

  let remainder = new BigNumber(value);
  while (index < units.length - 1 && remainder.isGreaterThanOrEqualTo(1000)) {
    remainder = remainder.dividedBy(1000);
    index++;
  }
  return `${remainder.toFixed(decimalPlaces)} ${units[index]}`;
}

export function formatRoundNumber(value: string, decimalPlaces: number = 0): string {
  const bigNum = BigNumber(value);
  if (bigNum.isNaN()) return 'NaN';

  return bigNum.toFixed(decimalPlaces);
}

export function formatCurrency(value: string, currencySymbol: string = '$', decimalPlaces: number = 2): string {
  const bigNum = formatLargeNumber(value, decimalPlaces);
  if (bigNum === 'Error') return 'NaN';

  return `${currencySymbol}${bigNum}`;
}

export function formatBaseDenom(val: string, decimalPlaces: number = 1): string {
  const bigNum = BigNumber(val);

  // Divide by 1e6 to convert to base denomination
  const converted = bigNum.dividedBy(1e6);
  if (converted.isNaN()) return 'NaN';

  return formatLargeNumber(converted.toFixed(decimalPlaces), decimalPlaces);
}

export function formatLargeNumber(val: string, decimalPlaces: number = 2): string {
  const bigNum = BigNumber(val);
  if (bigNum.isNaN()) return 'NaN';

  const isNegative = bigNum.isLessThan(0);
  const absolute = bigNum.abs();

  let ret = "";

  if (absolute.isZero()) ret = BigNumber(0).toFixed(decimalPlaces);
  else if (absolute.isLessThan(1e3)) ret = absolute.toFixed(decimalPlaces);
  else if (absolute.isLessThan(1e6)) ret = `${absolute.dividedBy(1e3).toFixed(decimalPlaces)} K`;
  else if (absolute.isLessThan(1e9)) ret = `${absolute.dividedBy(1e6).toFixed(decimalPlaces)} M`;
  else if (absolute.isLessThan(1e12)) ret = `${absolute.dividedBy(1e9).toFixed(decimalPlaces)} B`;
  else if (absolute.isLessThan(1e15)) ret = `${absolute.dividedBy(1e12).toFixed(decimalPlaces)} T`;
  else if (absolute.isLessThan(1e18)) ret = `${absolute.dividedBy(1e15).toFixed(decimalPlaces)} Q`;
  else if (absolute.isLessThan(1e21)) ret = `${absolute.dividedBy(1e18).toFixed(decimalPlaces)} E`;
  else if (absolute.isLessThan(1e24)) ret = `${absolute.dividedBy(1e21).toFixed(decimalPlaces)} Z`;
  else if (absolute.isLessThan(1e27)) ret = `${absolute.dividedBy(1e24).toFixed(decimalPlaces)} Y`;
  else if (absolute.isLessThan(1e30)) ret = `${absolute.dividedBy(1e27).toFixed(decimalPlaces)} X`;
  else if (absolute.isLessThan(1e33)) ret = `${absolute.dividedBy(1e30).toFixed(decimalPlaces)} W`;
  else ret = absolute.toExponential(decimalPlaces);

  return isNegative ? `-${ret}` : ret;
}

export function formatId(id: string): string {
   return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formats a date for chart tooltips in a consistent, readable format.
 * Example output: "16 Jan 2026, 14:30 UTC"
 */
export function formatChartDate(value: unknown): string {
  if (!value) return "N/A";
  return new Date(value as string | number | Date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });
}

