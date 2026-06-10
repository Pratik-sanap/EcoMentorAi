// src/engine/carbon/emissionFactors.ts
import { ActivitySubType } from "../../models/activity";

/**
 * Static emission factor for a single sub-activity.
 * All factors express kg CO₂ emitted per one unit of the activity.
 */
export interface EmissionFactor {
  /** kg CO₂ per unit of activity */
  kgCO2PerUnit: number;
  /** Human-readable unit label (e.g. "km", "day", "kWh") */
  unitLabel: string;
  /** Brief note on the data source */
  sourceNote: string;
}

/**
 * Realistic emission factors derived from publicly available data.
 *
 * Sources:
 * - Transport: UK DEFRA Conversion Factors 2023
 * - Food: Poore & Nemecek (2018), Science — lifecycle analysis
 * - Electricity: US EPA eGRID average (2022)
 * - Waste: EPA WARM model — mixed MSW to landfill
 */
export const EMISSION_FACTORS: Record<ActivitySubType, EmissionFactor> = {
  // ── Transport (kg CO₂ per km) ──────────────────────────────
  Car: {
    kgCO2PerUnit: 0.21,
    unitLabel: "km",
    sourceNote: "Average petrol car — DEFRA 2023",
  },
  Bus: {
    kgCO2PerUnit: 0.089,
    unitLabel: "km",
    sourceNote: "Average local bus per passenger — DEFRA 2023",
  },
  Train: {
    kgCO2PerUnit: 0.041,
    unitLabel: "km",
    sourceNote: "National rail per passenger — DEFRA 2023",
  },
  Bike: {
    kgCO2PerUnit: 0.0,
    unitLabel: "km",
    sourceNote: "Zero direct emissions",
  },
  Walking: {
    kgCO2PerUnit: 0.0,
    unitLabel: "km",
    sourceNote: "Zero direct emissions",
  },

  // ── Food (kg CO₂ per day of meals) ─────────────────────────
  Vegetarian: {
    kgCO2PerUnit: 3.5,
    unitLabel: "day",
    sourceNote: "Plant-based diet average — Poore & Nemecek 2018",
  },
  "Mixed Diet": {
    kgCO2PerUnit: 5.5,
    unitLabel: "day",
    sourceNote: "Average Western omnivore diet — Poore & Nemecek 2018",
  },
  "Heavy Meat Diet": {
    kgCO2PerUnit: 7.9,
    unitLabel: "day",
    sourceNote: "High red-meat diet — Poore & Nemecek 2018",
  },

  // ── Energy (kg CO₂ per kWh) ────────────────────────────────
  Electricity: {
    kgCO2PerUnit: 0.42,
    unitLabel: "kWh",
    sourceNote: "US average grid mix — EPA eGRID 2022",
  },

  // ── Waste (kg CO₂ per kg waste) ────────────────────────────
  Waste: {
    kgCO2PerUnit: 0.57,
    unitLabel: "kg",
    sourceNote: "Mixed MSW to landfill with methane capture — EPA WARM",
  },
};

/**
 * Returns the emission factor for a given sub-activity type.
 * This is a convenience wrapper that provides type safety.
 */
export const getEmissionFactor = (subType: ActivitySubType): EmissionFactor => {
  return EMISSION_FACTORS[subType];
};
