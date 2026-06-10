// src/models/userProfile.ts
import { Activity } from "./activity";
import { CarbonReport } from "./carbonReport";
import { Recommendation } from "./recommendation";
import { Challenge } from "./challenge";

/**
 * Simple boolean toggles that let the user enable/disable categories.
 */
export interface UserPreferences {
  transport: boolean;
  food: boolean;
  energy: boolean;
  waste: boolean;
  shopping: boolean;
}

/**
 * Root data structure persisted in browser LocalStorage.
 */
export interface UserProfile {
  /** Unique user identifier (UUID) */
  uid: string;
  /** User preference toggles */
  preferences: UserPreferences;
  /** Log of all recorded activities */
  activityLog: Activity[];
  /** Aggregated carbon report (optional, may be generated later) */
  carbonReport?: CarbonReport;
  /** List of recommendations produced by the engine */
  recommendations?: Recommendation[];
  /** Weekly challenges */
  challenges?: Challenge[];
  /** Timestamp of the last carbon‑calculation run (ISO string) */
  lastCalculatedAt?: string;
  /** Current carbon score (0‑100) */
  currentScore?: number;
  /** Number of consecutive weeks the user has improved */
  streakCount?: number;
  /** Consecutive days of activity logging */
  streakDays?: number;
  /** Best streak of consecutive days of activity logging */
  bestStreakDays?: number;
  /** Consecutive weeks of improvement */
  streakWeeksImprovement?: number;
  /** Earned achievement badges */
  badges?: string[];
}
