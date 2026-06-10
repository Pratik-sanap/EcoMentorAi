// src/models/challenge.ts
export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeCategory = "transport" | "food" | "energy" | "waste" | "shopping";

export interface Challenge {
  /** Unique challenge identifier */
  id: string;
  /** Short title of the challenge */
  title: string;
  /** Detailed description of action required */
  description: string;
  /** Carbon score points awarded upon completion */
  points: number;
  /** Difficulty rating */
  difficulty: ChallengeDifficulty;
  /** Focus category */
  category: ChallengeCategory;
  /** Target value to reach (e.g., number of public transit trips, kg of waste saved) */
  targetValue: number;
  /** Current accumulated progress towards the target */
  currentValue: number;
  /** Whether the user has completed this challenge */
  isCompleted: boolean;
  /** Date when the challenge was assigned (ISO format) */
  assignedAt: string;
}
