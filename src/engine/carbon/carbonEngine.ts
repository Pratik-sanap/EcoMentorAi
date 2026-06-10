// src/engine/carbon/carbonEngine.ts
import { Activity, ActivityType } from "../../models/activity";
import { CarbonBreakdown, CarbonReport } from "../../models/carbonReport";
import { EMISSION_FACTORS } from "./emissionFactors";

/**
 * Calculates the CO₂ emission for a single activity entry.
 * @param activity — a logged user activity with subType, amount, and unit
 * @returns emission in kg CO₂
 */
export const calculateActivityEmission = (activity: Activity): number => {
  const factor = EMISSION_FACTORS[activity.subType];
  return activity.amount * factor.kgCO2PerUnit;
};

/**
 * Calculates the total CO₂ emission across all activities.
 * @param activities — array of user activities
 * @returns total emission in kg CO₂
 */
export const calculateTotalEmission = (activities: Activity[]): number => {
  return activities.reduce((total, activity) => {
    return total + calculateActivityEmission(activity);
  }, 0);
};

/**
 * Builds a breakdown of emissions grouped by ActivityType.
 * @param activities — array of user activities
 * @returns object mapping ActivityType → total kg CO₂
 */
const buildCategoryBreakdown = (activities: Activity[]): CarbonBreakdown => {
  const breakdown: CarbonBreakdown = {};

  for (const activity of activities) {
    const emission = calculateActivityEmission(activity);
    const category = activity.type;
    breakdown[category] = (breakdown[category] ?? 0) + emission;
  }

  return breakdown;
};

/**
 * Determines the category with the highest emissions.
 * Returns "None" if no activities exist.
 */
const findTopEmissionCategory = (breakdown: CarbonBreakdown): string => {
  let topCategory = "None";
  let topValue = 0;

  for (const [category, value] of Object.entries(breakdown)) {
    if (value > topValue) {
      topValue = value;
      topCategory = category;
    }
  }

  return topCategory;
};

/**
 * Calculates a monthly (30-day) projection based on the span of logged activities.
 * If all activities are on the same day, projects as if that's one day of data.
 */
const calculateMonthlyProjection = (
  activities: Activity[],
  totalEmission: number
): number => {
  if (activities.length === 0) return 0;

  const dates = activities.map((a) => new Date(a.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);

  // Calculate span in days (minimum 1 to avoid division by zero)
  const spanMs = maxDate - minDate;
  const spanDays = Math.max(1, Math.ceil(spanMs / (1000 * 60 * 60 * 24)));

  // Daily average × 30 days
  const dailyAverage = totalEmission / spanDays;
  return Math.round(dailyAverage * 30 * 100) / 100;
};

/**
 * Generates a comprehensive carbon report from the user's activity log.
 *
 * @param activities — full activity log from the user profile
 * @returns a CarbonReport with total, breakdown, monthly projection, and top category
 */
export const generateCarbonReport = (activities: Activity[]): CarbonReport => {
  const totalKgCO2 = calculateTotalEmission(activities);
  const breakdown = buildCategoryBreakdown(activities);
  const monthlyProjection = calculateMonthlyProjection(activities, totalKgCO2);
  const topEmissionCategory = findTopEmissionCategory(breakdown);

  return {
    totalKgCO2: Math.round(totalKgCO2 * 100) / 100,
    breakdown,
    monthlyProjection,
    topEmissionCategory,
    date: new Date().toISOString(),
  };
};
