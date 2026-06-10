// src/lib/format.ts
/**
 * Utility functions for formatting values in the application.
 */

/**
 * Formats a carbon footprint value in kilograms of CO2 equivalent (kg CO2e).
 * If the value is large (e.g. >= 1000 kg), formats as metric tons (t CO2e).
 */
export const formatCarbon = (kgCO2e: number): string => {
  if (kgCO2e >= 1000) {
    const tons = kgCO2e / 1000;
    return `${tons.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t CO2e`;
  }
  return `${Math.round(kgCO2e).toLocaleString()} kg CO2e`;
};

/**
 * Formats a number with commas for readibility.
 */
export const formatNumber = (num: number, maxDecimals = 1): string => {
  return num.toLocaleString(undefined, {
    maximumFractionDigits: maxDecimals,
  });
};

/**
 * Formats a percentage value.
 */
export const formatPercent = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};
