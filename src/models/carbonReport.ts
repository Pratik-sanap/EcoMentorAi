// src/models/carbonReport.ts
export interface CarbonBreakdown {
  /** Emissions per activity type (kg CO₂) */
  [activity: string]: number;
}

export interface CarbonReport {
  /** Total carbon emitted in the period (kg CO₂) */
  totalKgCO2: number;
  /** Detailed breakdown by ActivityType */
  breakdown: CarbonBreakdown;
  /** Date for the report (ISO string) */
  date: string;
}
