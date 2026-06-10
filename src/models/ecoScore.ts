// src/models/ecoScore.ts

/** Eco score level labels mapped to score ranges */
export type ScoreLevel = "Eco Champion" | "Eco Aware" | "Improving" | "High Impact";

/**
 * Output of the scoring engine.
 * Represents the user's environmental performance rating.
 */
export interface EcoScore {
  /** Numeric score from 0 (worst) to 100 (excellent) */
  score: number;
  /** Human-readable score classification */
  scoreLevel: ScoreLevel;
  /** Points the user could gain by adopting best practices */
  improvementPotential: number;
}
