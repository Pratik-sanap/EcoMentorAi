import { generateRecommendations } from "../engine/recommendation/recommendationEngine";
import { Activity, ActivityType, Unit } from "../models/activity";
import { CarbonReport } from "../models/carbonReport";
import { EcoScore } from "../models/ecoScore";

describe("recommendationEngine", () => {
  const dummyEcoScore: EcoScore = {
    score: 60,
    scoreLevel: "Improving",
    improvementPotential: 40
  };
  const emptyActivities: Activity[] = [];

  it("returns no recommendations when total kg CO2 is 0", () => {
    const emptyReport: CarbonReport = {
      totalKgCO2: 0,
      breakdown: {},
      monthlyProjection: 0,
      topEmissionCategory: "None",
      date: new Date().toISOString()
    };

    const result = generateRecommendations(emptyReport, dummyEcoScore, emptyActivities);
    expect(result.biggestOpportunity).toBeNull();
    expect(result.recommendations).toHaveLength(0);
  });

  it("generates correct biggest opportunity for transport", () => {
    const report: CarbonReport = {
      totalKgCO2: 100,
      breakdown: { [ActivityType.Transport]: 100 },
      monthlyProjection: 3000,
      topEmissionCategory: ActivityType.Transport,
      date: new Date().toISOString()
    };

    const result = generateRecommendations(report, dummyEcoScore, emptyActivities);
    expect(result.biggestOpportunity).not.toBeNull();
    expect(result.biggestOpportunity?.topEmissionSource).toBe("Transport");
    expect(result.biggestOpportunity?.bestImprovementOpportunity).toBe("Switch to Public Transport");
    
    // Transport rec impact is 40% of breakdown: 100 * 0.4 = 40
    expect(result.biggestOpportunity?.estimatedCO2Savings).toBe(40);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].id).toBe("rec-transport");
  });

  it("sorts recommendations by impact", () => {
    const report: CarbonReport = {
      totalKgCO2: 200,
      breakdown: { 
        [ActivityType.Transport]: 100, // impact 40
        [ActivityType.Waste]: 100 // impact 50
      },
      monthlyProjection: 6000,
      topEmissionCategory: ActivityType.Waste,
      date: new Date().toISOString()
    };

    const result = generateRecommendations(report, dummyEcoScore, emptyActivities);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
    // Highest impact first
    expect(result.recommendations[0].id).toBe("rec-waste");
    expect(result.recommendations[1].id).toBe("rec-transport");
  });
});
