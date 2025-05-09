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

export function formatCurrency(value: BigNumber, currencySymbol: string = '$', decimalPlaces: number = 2): string {
  const fixedValue = value.toFixed(decimalPlaces);
  const parts = fixedValue.split('.');
  const integerPart = BigInt(parts[0]).toLocaleString();
  const decimalPart = parts[1];
  return `${currencySymbol}${integerPart}.${decimalPart}`;
}