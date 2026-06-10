// src/engine/recommendation/recommendationEngine.ts
import { Activity, ActivityType } from "../../models/activity";
import { CarbonReport } from "../../models/carbonReport";
import { EcoScore } from "../../models/ecoScore";
import { Recommendation, RecCategory, BiggestOpportunity } from "../../models/recommendation";

export interface RecommendationEngineOutput {
  biggestOpportunity: BiggestOpportunity | null;
  recommendations: Recommendation[];
}

export const generateRecommendations = (
  report: CarbonReport,
  ecoScore: EcoScore,
  activities: Activity[]
): RecommendationEngineOutput => {
  if (!report || report.totalKgCO2 === 0) {
    return { biggestOpportunity: null, recommendations: [] };
  }

  const topCategory = report.topEmissionCategory as ActivityType | string;
  let biggestOpportunity: BiggestOpportunity | null = null;
  const recommendations: Recommendation[] = [];

  // Default fallback recommendations based on category
  const transportRec: Recommendation = {
    id: "rec-transport",
    title: "Opt for Public Transport",
    category: RecCategory.Transportation,
    description: "Switching from personal car travel to public transport (bus or train) can drastically cut your travel footprint.",
    impactKgCO2: Math.round((report.breakdown[ActivityType.Transport] || 0) * 0.4), // Estimate 40% saving
    actionable: true,
  };

  const foodRec: Recommendation = {
    id: "rec-food",
    title: "Reduce Meat Consumption",
    category: RecCategory.Food,
    description: "Transitioning towards a plant-based or vegetarian diet significantly lowers emissions from agriculture and supply chains.",
    impactKgCO2: Math.round((report.breakdown[ActivityType.Food] || 0) * 0.3), // Estimate 30% saving
    actionable: true,
  };

  const energyRec: Recommendation = {
    id: "rec-energy",
    title: "Reduce Electricity Usage",
    category: RecCategory.Energy,
    description: "Lowering heating temperatures and switching to energy-efficient lighting can greatly decrease your home energy footprint.",
    impactKgCO2: Math.round((report.breakdown[ActivityType.Energy] || 0) * 0.25), // Estimate 25% saving
    actionable: true,
  };

  const wasteRec: Recommendation = {
    id: "rec-waste",
    title: "Recycling & Waste Reduction",
    category: RecCategory.Waste,
    description: "Improving recycling habits and reducing single-use plastics directly lowers landfill methane emissions.",
    impactKgCO2: Math.round((report.breakdown[ActivityType.Waste] || 0) * 0.5), // Estimate 50% saving
    actionable: true,
  };

  // Build the list of all relevant recommendations (exclude zero impact if needed, but we keep simple)
  if (report.breakdown[ActivityType.Transport] > 0) recommendations.push(transportRec);
  if (report.breakdown[ActivityType.Food] > 0) recommendations.push(foodRec);
  if (report.breakdown[ActivityType.Energy] > 0) recommendations.push(energyRec);
  if (report.breakdown[ActivityType.Waste] > 0) recommendations.push(wasteRec);

  // Determine biggest opportunity based on rules
  if (topCategory === ActivityType.Transport) {
    biggestOpportunity = {
      topEmissionSource: "Transport",
      bestImprovementOpportunity: "Switch to Public Transport",
      estimatedCO2Savings: transportRec.impactKgCO2,
      difficultyLevel: "Medium",
      personalizedExplanation: "Your transport emissions are your largest contributor. Replacing even a fraction of your car journeys with bus or train can yield the highest reduction in your footprint.",
    };
  } else if (topCategory === ActivityType.Food) {
    biggestOpportunity = {
      topEmissionSource: "Food",
      bestImprovementOpportunity: "Reduce Meat Consumption",
      estimatedCO2Savings: foodRec.impactKgCO2,
      difficultyLevel: "Hard",
      personalizedExplanation: "Dietary choices make up the majority of your carbon footprint. Opting for vegetarian or plant-based meals several times a week offers the most significant potential savings.",
    };
  } else if (topCategory === ActivityType.Energy) {
    biggestOpportunity = {
      topEmissionSource: "Energy",
      bestImprovementOpportunity: "Reduce Electricity Usage",
      estimatedCO2Savings: energyRec.impactKgCO2,
      difficultyLevel: "Easy",
      personalizedExplanation: "Home energy is dominating your emissions. Simple actions like adjusting the thermostat or switching to LED lighting can provide immediate and substantial CO₂ reductions.",
    };
  } else if (topCategory === ActivityType.Waste) {
    biggestOpportunity = {
      topEmissionSource: "Waste",
      bestImprovementOpportunity: "Recycling and Waste Reduction",
      estimatedCO2Savings: wasteRec.impactKgCO2,
      difficultyLevel: "Easy",
      personalizedExplanation: "Waste generation is currently your top emission source. Diligent recycling and minimizing single-use items is the quickest way to improve your Eco Score.",
    };
  } else {
    // Fallback if top category is shopping or something else
    biggestOpportunity = {
      topEmissionSource: topCategory,
      bestImprovementOpportunity: "General Lifestyle Adjustment",
      estimatedCO2Savings: 10,
      difficultyLevel: "Medium",
      personalizedExplanation: "Review your activities to find areas where small reductions can add up to meaningful carbon savings.",
    };
  }

  // Sort recommendations by impact
  recommendations.sort((a, b) => b.impactKgCO2 - a.impactKgCO2);

  return { biggestOpportunity, recommendations };
};
