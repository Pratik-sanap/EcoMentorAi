import { calculateActivityEmission, calculateTotalEmission, generateCarbonReport } from "../engine/carbon/carbonEngine";
import { Activity, ActivityType, Unit } from "../models/activity";

describe("carbonEngine", () => {
  const mockActivities: Activity[] = [
    {
      id: "1",
      type: ActivityType.Transport,
      subType: "Car",
      amount: 100,
      unit: Unit.Km,
      date: "2023-10-01T10:00:00Z"
    },
    {
      id: "2",
      type: ActivityType.Food,
      subType: "Vegetarian",
      amount: 2,
      unit: Unit.Day,
      date: "2023-10-02T10:00:00Z"
    }
  ];

  it("calculates single activity emission correctly", () => {
    const emission = calculateActivityEmission(mockActivities[0]);
    // Car factor: 0.21. 100 * 0.21 = 21
    expect(emission).toBeCloseTo(21);
  });

  it("calculates total emission correctly", () => {
    const total = calculateTotalEmission(mockActivities);
    // Car: 21. Vegetarian: 3.5 * 2 = 7. Total: 28
    expect(total).toBeCloseTo(28);
  });

  it("generates a carbon report correctly", () => {
    const report = generateCarbonReport(mockActivities);
    expect(report.totalKgCO2).toBeCloseTo(28);
    expect(report.breakdown[ActivityType.Transport]).toBeCloseTo(21);
    expect(report.breakdown[ActivityType.Food]).toBeCloseTo(7);
    expect(report.topEmissionCategory).toBe(ActivityType.Transport);
    
    // Span = 1 day (difference between dates). Total = 28. Daily average = 28. Monthly = 28 * 30 = 840.
    expect(report.monthlyProjection).toBeCloseTo(840);
  });
});
