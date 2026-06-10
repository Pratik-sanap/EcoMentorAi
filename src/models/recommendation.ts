// src/models/recommendation.ts
export enum RecCategory {
  Lifestyle = 'Lifestyle',
  Transportation = 'Transportation',
  Food = 'Food',
  Energy = 'Energy',
  Waste = 'Waste',
}

export interface Recommendation {
  /** Unique identifier */
  id: string;
  /** Short title */
  title: string;
  /** Detailed description */
  description: string;
  /** Expected carbon reduction in kg CO₂ */
  impactKgCO2: number;
  /** Category for grouping */
  category: RecCategory;
  /** Whether the recommendation is directly actionable */
  actionable: boolean;
}
