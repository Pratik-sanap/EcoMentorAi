// src/engine/challenge/challengeEngine.ts
import { Challenge, ChallengeDifficulty, ChallengeCategory } from "../../models/challenge";
import { UserProfile } from "../../models/userProfile";
import { Activity, ActivityType } from "../../models/activity";

interface ChallengeTemplate {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  points: number;
  targetValue: number;
  estimatedCO2Savings: number;
  evaluator: (activities: Activity[]) => number;
}

// Get Monday of the current week (ISO week)
export function getStartOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    title: "Active Commuter",
    description: "Walk or bike 5 km instead of driving.",
    difficulty: "easy",
    category: "transport",
    points: 40,
    targetValue: 5,
    estimatedCO2Savings: 10,
    evaluator: (activities) => {
      return activities
        .filter(
          (a) =>
            a.type === ActivityType.Transport &&
            (a.subType === "Walking" || a.subType === "Bike")
        )
        .reduce((sum, a) => sum + a.amount, 0);
    },
  },
  {
    title: "Transit Advocate",
    description: "Use public transport (bus or train) at least 3 times.",
    difficulty: "easy",
    category: "transport",
    points: 50,
    targetValue: 3,
    estimatedCO2Savings: 15,
    evaluator: (activities) => {
      return activities.filter(
        (a) =>
          a.type === ActivityType.Transport &&
          (a.subType === "Bus" || a.subType === "Train")
      ).length;
    },
  },
  {
    title: "Plant Powered",
    description: "Log at least 3 Vegetarian meals.",
    difficulty: "medium",
    category: "food",
    points: 60,
    targetValue: 3,
    estimatedCO2Savings: 18,
    evaluator: (activities) => {
      return activities.filter(
        (a) => a.type === ActivityType.Food && a.subType === "Vegetarian"
      ).length;
    },
  },
  {
    title: "Vampire Power Cut",
    description: "Reduce home energy usage! Log electricity usage under 15 kWh at least 2 times.",
    difficulty: "medium",
    category: "energy",
    points: 70,
    targetValue: 2,
    estimatedCO2Savings: 22,
    evaluator: (activities) => {
      return activities.filter(
        (a) =>
          a.type === ActivityType.Energy &&
          a.subType === "Electricity" &&
          a.amount < 15
      ).length;
    },
  },
  {
    title: "Zero Waste Hero",
    description: "Log organic waste disposal or recycling at least 3 times.",
    difficulty: "easy",
    category: "waste",
    points: 40,
    targetValue: 3,
    estimatedCO2Savings: 8,
    evaluator: (activities) => {
      return activities.filter((a) => a.type === ActivityType.Waste).length;
    },
  },
  {
    title: "Conscious Consumer",
    description: "Avoid luxury shopping: log at most 1 shopping activity this week (target is 0 or 1).",
    difficulty: "hard",
    category: "shopping",
    points: 80,
    targetValue: 1,
    estimatedCO2Savings: 25,
    evaluator: (activities) => {
      // For this hard challenge, if shopping count <= 1, progress is 1, else 0
      const count = activities.filter((a) => a.type === ActivityType.Shopping).length;
      return count <= 1 ? 1 : 0;
    },
  },
];

/**
 * Generates 3 weekly challenges dynamically based on user preferences and top emission category
 */
export function generateWeeklyChallenges(profile: UserProfile): Challenge[] {
  const startOfWeek = getStartOfCurrentWeek();
  
  // Filter templates based on user enabled categories
  const enabledCategories = Object.entries(profile.preferences)
    .filter(([, enabled]) => enabled)
    .map(([cat]) => cat.toLowerCase());

  let templates = CHALLENGE_TEMPLATES.filter((t) =>
    enabledCategories.includes(t.category)
  );

  // Fallback to all if somehow none are enabled
  if (templates.length === 0) {
    templates = CHALLENGE_TEMPLATES;
  }

  // Prioritize category based on top emission category if present
  const topCategory = profile.carbonReport?.topEmissionCategory?.toLowerCase();
  
  // Shuffle templates randomly, but place matching topCategory templates first
  const sortedTemplates = [...templates].sort((a, b) => {
    if (a.category === topCategory && b.category !== topCategory) return -1;
    if (b.category === topCategory && a.category !== topCategory) return 1;
    return Math.random() - 0.5;
  });

  // Pick top 3 unique challenges
  const selected = sortedTemplates.slice(0, 3);
  const assignedDate = startOfWeek.toISOString();

  return selected.map((t, idx) => ({
    id: `challenge-${Date.now()}-${idx}`,
    title: t.title,
    description: t.description,
    points: t.points,
    difficulty: t.difficulty,
    category: t.category,
    targetValue: t.targetValue,
    currentValue: 0,
    isCompleted: false,
    assignedAt: assignedDate,
    estimatedCO2Savings: t.estimatedCO2Savings,
  }));
}

/**
 * Evaluates the progress of active challenges based on the activity history of the current week.
 */
export function evaluateChallengeProgress(
  challenges: Challenge[],
  activityLog: Activity[]
): Challenge[] {
  const startOfWeek = getStartOfCurrentWeek().getTime();
  
  // Filter activities from this week
  const weeklyActivities = activityLog.filter(
    (a) => new Date(a.date).getTime() >= startOfWeek
  );

  return challenges.map((challenge) => {
    // Find matching template
    const template = CHALLENGE_TEMPLATES.find((t) => t.title === challenge.title);
    if (!template) return challenge;

    const progress = template.evaluator(weeklyActivities);
    const cappedProgress = Math.min(progress, challenge.targetValue);
    const isCompleted = cappedProgress >= challenge.targetValue;

    return {
      ...challenge,
      currentValue: parseFloat(cappedProgress.toFixed(1)),
      isCompleted,
    };
  });
}
