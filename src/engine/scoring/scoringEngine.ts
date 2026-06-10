// src/engine/scoring/scoringEngine.ts
import { Activity, ActivityType } from "../../models/activity";
import { CarbonReport } from "../../models/carbonReport";
import { EcoScore, ScoreLevel } from "../../models/ecoScore";

/**
 * Global daily emission benchmark in kg CO₂.
 * Based on ~4 tonnes CO₂/year average per capita
 * with lifestyle overhead → ≈ 22 kg/day.
 */
const BENCHMARK_DAILY_KG_CO2 = 22;

/** Bonus points for using sustainable transport (Bike/Walking) */
const SUSTAINABLE_TRANSPORT_BONUS = 5;

/** Bonus points for logging vegetarian meals */
const SUSTAINABLE_DIET_BONUS = 5;

/** Penalty when a single category dominates (>70%) total emissions */
const CONCENTRATION_PENALTY = 5;

/**
 * Maps a numeric score (0–100) to its ScoreLevel label.
 */
const getScoreLevel = (score: number): ScoreLevel => {
  if (score >= 90) return "Eco Champion";
  if (score >= 70) return "Eco Aware";
  if (score >= 50) return "Improving";
  return "High Impact";
};

/**
 * Checks whether any activity in the log uses sustainable transport (Bike or Walking).
 */
const hasSustainableTransport = (activities: Activity[]): boolean => {
  return activities.some(
    (a) => a.type === ActivityType.Transport && (a.subType === "Bike" || a.subType === "Walking")
  );
};

/**
 * Checks whether any activity in the log uses a vegetarian diet.
 */
const hasVegetarianMeals = (activities: Activity[]): boolean => {
  return activities.some(
    (a) => a.type === ActivityType.Food && a.subType === "Vegetarian"
  );
};

/**
 * Checks whether any single category exceeds 70% of total emissions.
 */
const hasConcentrationIssue = (report: CarbonReport): boolean => {
  if (report.totalKgCO2 === 0) return false;

  for (const value of Object.values(report.breakdown)) {
    if (value / report.totalKgCO2 > 0.7) return true;
  }

  return false;
};

/**
 * Calculates the average daily emission from the activity log.
 * Uses the date span of the logged activities to determine the period.
 */
const calculateDailyEmission = (activities: Activity[], totalKgCO2: number): number => {
  if (activities.length === 0) return 0;

  const dates = activities.map((a) => new Date(a.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);

  const spanMs = maxDate - minDate;
  const spanDays = Math.max(1, Math.ceil(spanMs / (1000 * 60 * 60 * 24)));

  return totalKgCO2 / spanDays;
};

/**
 * Calculates the Eco Score for a user based on their carbon report and activity log.
 *
 * Formula:
 *   baseScore = max(0, 100 − (dailyEmission / benchmark) × 100)
 *   + sustainableTransportBonus (+5)
 *   + vegetarianDietBonus (+5)
 *   − concentrationPenalty (−5)
 *   Clamped to [0, 100]
 *
 * @param report — the generated CarbonReport
 * @param activities — the full activity log
 * @returns an EcoScore with numeric score, level, and improvement potential
 */
export const calculateEcoScore = (
  report: CarbonReport,
  activities: Activity[]
): EcoScore => {
  // Handle empty activity log — return a neutral score
  if (activities.length === 0) {
    return {
      score: 50,
      scoreLevel: "Improving",
      improvementPotential: 50,
    };
  }

  const dailyEmission = calculateDailyEmission(activities, report.totalKgCO2);

  // Base score: if below benchmark, full score; otherwise sqrt decay
  let baseScore: number;
  if (dailyEmission <= BENCHMARK_DAILY_KG_CO2) {
    baseScore = 100;
  } else {
    baseScore = Math.max(0, 100 * Math.sqrt(BENCHMARK_DAILY_KG_CO2 / dailyEmission));
  }
  let score = Math.round(baseScore);

  // Apply bonuses
  if (hasSustainableTransport(activities)) {
    score += SUSTAINABLE_TRANSPORT_BONUS;
  }
  if (hasVegetarianMeals(activities)) {
    score += SUSTAINABLE_DIET_BONUS;
  }

  // Apply penalties
  if (hasConcentrationIssue(report)) {
    score -= CONCENTRATION_PENALTY;
  }

  // Clamp to valid range
  score = Math.round(Math.min(100, Math.max(0, score)));

  const scoreLevel = getScoreLevel(score);
  const improvementPotential = 100 - score;

  return {
    score,
    scoreLevel,
    improvementPotential,
  };
};
