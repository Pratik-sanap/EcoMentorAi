import { calculateEcoScore } from "../engine/scoring/scoringEngine";
import { Activity, ActivityType, Unit } from "../models/activity";
import { CarbonReport } from "../models/carbonReport";

describe("scoringEngine", () => {
  it("returns neutral score for empty activity log", () => {
    const emptyActivities: Activity[] = [];
    const dummyReport: CarbonReport = {
      totalKgCO2: 0,
      breakdown: {},
      monthlyProjection: 0,
      topEmissionCategory: "None",
      date: new Date().toISOString()
    };
    const ecoScore = calculateEcoScore(dummyReport, emptyActivities);
    expect(ecoScore.score).toBe(50);
    expect(ecoScore.scoreLevel).toBe("Improving");
    expect(ecoScore.improvementPotential).toBe(50);
  });

  it("applies bonuses for sustainable transport and diet", () => {
    const activities: Activity[] = [
      {
        id: "1",
        type: ActivityType.Transport,
        subType: "Bike",
        amount: 10,
        unit: Unit.Km,
        date: "2023-10-01T10:00:00Z"
      },
      {
        id: "2",
        type: ActivityType.Food,
        subType: "Vegetarian",
        amount: 1,
        unit: Unit.Day,
        date: "2023-10-01T10:00:00Z"
      }
    ];
    const report: CarbonReport = {
      totalKgCO2: 3.5,
      breakdown: { [ActivityType.Transport]: 0, [ActivityType.Food]: 3.5 },
      monthlyProjection: 3.5 * 30,
      topEmissionCategory: ActivityType.Food,
      date: new Date().toISOString()
    };

    const ecoScore = calculateEcoScore(report, activities);
    
    expect(ecoScore.score).toBe(100);
    expect(ecoScore.scoreLevel).toBe("Eco Champion");
  });

  it("applies concentration penalty and limits base score", () => {
    const activities: Activity[] = [
      {
        id: "1",
        type: ActivityType.Transport,
        subType: "Car",
        amount: 500,
        unit: Unit.Km,
        date: "2023-10-01T10:00:00Z"
      }
    ];
    const report: CarbonReport = {
      totalKgCO2: 105,
      breakdown: { [ActivityType.Transport]: 105 },
      monthlyProjection: 105 * 30,
      topEmissionCategory: ActivityType.Transport,
      date: new Date().toISOString()
    };

    const ecoScore = calculateEcoScore(report, activities);
    expect(ecoScore.score).toBeLessThan(50);
    expect(ecoScore.scoreLevel).toBe("High Impact");
  });
});
