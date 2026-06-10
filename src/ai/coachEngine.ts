// src/ai/coachEngine.ts
import { Activity, ActivityType } from "../models/activity";
import { Recommendation } from "../models/recommendation";

export interface CoachInsights {
  weeklySummary: string;
  biggestImprovementArea: string;
  positiveReinforcement: string;
  personalizedAdvice: string;
  fullAdviceText: string; // The combined paragraph as shown in the example
}

/**
 * Dynamically generates personalized coaching insights using rule-based heuristics
 */
export function generateCoachInsights(
  ecoScore: number,
  topEmissionCategory: string | undefined,
  recommendations: Recommendation[] | undefined,
  activityHistory: Activity[]
): CoachInsights {
  // 1. Weekly Summary
  let weeklySummary = "";
  if (ecoScore >= 80) {
    weeklySummary = "Fantastic performance this week! Your carbon footprint is significantly lower than average, reflecting your excellent choice of sustainable habits.";
  } else if (ecoScore >= 60) {
    weeklySummary = "Solid effort. You're maintaining a moderate footprint, but there are clear areas where optimization can save carbon and boost your Eco Score.";
  } else {
    weeklySummary = "Your carbon footprint is currently elevated, mainly due to high resource usage. Let's work on focusing on key areas to bring down your impact.";
  }

  // 2. Biggest Improvement Area
  let biggestImprovementArea = "";
  const topCatNormalized = topEmissionCategory?.toLowerCase() || "";
  
  if (topCatNormalized.includes("transport")) {
    biggestImprovementArea = "Your largest opportunity is transportation emissions. Commutes using single-occupancy vehicles or high-mileage road trips add up quickly.";
  } else if (topCatNormalized.includes("food")) {
    biggestImprovementArea = "Your diet is currently your leading emission source. High meat and dairy consumption carry a substantial carbon footprint.";
  } else if (topCatNormalized.includes("energy")) {
    biggestImprovementArea = "Your household energy consumption is the biggest driver of your emissions. Unplugging idle devices and running appliances efficiently will help.";
  } else if (topCatNormalized.includes("waste")) {
    biggestImprovementArea = "Waste disposal is your biggest area for growth. Landfilled waste generates significant methane, making composting and recycling key.";
  } else if (topCatNormalized.includes("shopping")) {
    biggestImprovementArea = "Purchasing consumer goods and luxury shopping has a high lifecycle carbon footprint, indicating room to focus on secondhand or essential purchases.";
  } else {
    biggestImprovementArea = "Your carbon footprint is distributed, but reducing overall resource usage offers a great opportunity for improvement.";
  }

  // 3. Positive Reinforcement
  let positiveReinforcement = "";
  // Check activities for good habits in current week (or overall log)
  const walkingOrBike = activityHistory.some(
    (a) => a.type === ActivityType.Transport && (a.subType === "Walking" || a.subType === "Bike")
  );
  const transit = activityHistory.some(
    (a) => a.type === ActivityType.Transport && (a.subType === "Bus" || a.subType === "Train")
  );
  const veg = activityHistory.some(
    (a) => a.type === ActivityType.Food && a.subType === "Vegetarian"
  );
  const lowEnergy = activityHistory.some(
    (a) => a.type === ActivityType.Energy && a.subType === "Electricity" && a.amount < 15
  );

  if (walkingOrBike) {
    positiveReinforcement = "Great work choosing active transport like walking or biking this week! It directly reduces transport emissions and benefits your physical health.";
  } else if (transit) {
    positiveReinforcement = "Outstanding job opting for public transit. Using shared transit routes represents a massive fractional reduction in individual travel footprint.";
  } else if (veg) {
    positiveReinforcement = "Excellent effort logging plant-based meals. Transitioning meals to vegetarian options is one of the single most powerful steps to lower agricultural emissions.";
  } else if (lowEnergy) {
    positiveReinforcement = "Kudos on keeping your electricity usage low. Energy efficiency is key to grid decarbonization.";
  } else {
    positiveReinforcement = "Great work logging your activities consistently this week! High visibility into daily habits is the foundation of lasting lifestyle improvements.";
  }

  // 4. Personalized Advice
  let personalizedAdvice = "";
  if (topCatNormalized.includes("transport")) {
    personalizedAdvice = "Try replacing at least two short vehicle trips per week with walking, cycling, or transit to noticeably elevate your Eco Score.";
  } else if (topCatNormalized.includes("food")) {
    personalizedAdvice = "Reducing meat intake by just two meals per week could significantly improve your food category footprint and raise your overall Eco Score.";
  } else if (topCatNormalized.includes("energy")) {
    personalizedAdvice = "Unplugging household electronics when not in use and choosing cold-water laundry cycles will lower your energy emissions and electricity bill.";
  } else if (topCatNormalized.includes("waste")) {
    personalizedAdvice = "Try starting a small organic composting bin at home or ensuring 100% of recyclable plastic/paper is correctly sorted this week.";
  } else {
    personalizedAdvice = "Review the top suggestions on your Recommendations tab to pick one small daily change, such as skipping express shipping.";
  }

  // Construct combined text (mirroring the example format in requirements)
  // Example: "Great work reducing transport emissions this week. Your largest opportunity is food consumption. Reducing meat intake by two meals per week could significantly improve your Eco Score."
  const exampleStyleText = `${positiveReinforcement} ${biggestImprovementArea} ${personalizedAdvice}`;

  return {
    weeklySummary,
    biggestImprovementArea,
    positiveReinforcement,
    personalizedAdvice,
    fullAdviceText: exampleStyleText,
  };
}
