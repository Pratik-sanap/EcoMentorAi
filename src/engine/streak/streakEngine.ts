// src/engine/streak/streakEngine.ts
import { Activity } from "../../models/activity";
import { EMISSION_FACTORS } from "../carbon/emissionFactors";

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  weeksImprovement: number;
  badges: string[];
}

/**
 * Calculates user streak statistics and achievement badges based on the activity history.
 */
export function calculateStreakAndBadges(activityLog: Activity[]): StreakStats {
  if (activityLog.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      weeksImprovement: 0,
      badges: [],
    };
  }

  // 1. Calculate consecutive days of logging
  // Parse local dates (YYYY-MM-DD)
  const uniqueDates = Array.from(
    new Set(
      activityLog.map((a) => {
        const d = new Date(a.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
        ).padStart(2, "0")}`;
      })
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending (newest first)

  let currentStreak = 0;
  let bestStreak = 0;

  if (uniqueDates.length > 0) {
    const todayStr = getLocalDateString(new Date());
    const yesterdayStr = getLocalDateString(
      new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    // Check if user logged today or yesterday to maintain active streak
    const mostRecentDate = uniqueDates[0];
    const hasLoggedRecently =
      mostRecentDate === todayStr || mostRecentDate === yesterdayStr;

    if (hasLoggedRecently) {
      currentStreak = 1;
      let prevDate = new Date(mostRecentDate);

      for (let i = 1; i < uniqueDates.length; i++) {
        const currDate = new Date(uniqueDates[i]);
        const diffDays = Math.round(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          currentStreak++;
          prevDate = currDate;
        } else if (diffDays > 1) {
          break; // streak broken
        }
      }
    }

    // Calculate best streak
    let tempStreak = 1;
    let prevDate = new Date(uniqueDates[uniqueDates.length - 1]); // oldest

    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        tempStreak = 1;
      }
      prevDate = currDate;
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  // Ensure bestStreak is at least the currentStreak
  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  // 2. Calculate consecutive weeks of improvement
  // Group activities into weekly emissions starting from Monday of each week
  const weeklyEmissions = new Map<string, number>();
  for (const a of activityLog) {
    const d = new Date(a.date);
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(d.setDate(diff));
    const weekKey = `${startOfWeek.getFullYear()}-${String(
      startOfWeek.getMonth() + 1
    ).padStart(2, "0")}-${String(startOfWeek.getDate()).padStart(2, "0")}`;

    const factor = EMISSION_FACTORS[a.subType];
    const emission = a.amount * (factor?.kgCO2PerUnit ?? 0);
    weeklyEmissions.set(weekKey, (weeklyEmissions.get(weekKey) ?? 0) + emission);
  }

  // Sort weeks ascending (oldest to newest)
  const sortedWeeks = Array.from(weeklyEmissions.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let weeksImprovement = 0;
  // Starting from the last week and going backwards, count how many weeks had lower emissions than the previous week
  for (let i = sortedWeeks.length - 1; i > 0; i--) {
    const currentWeekEmissions = weeklyEmissions.get(sortedWeeks[i]) ?? 0;
    const previousWeekEmissions = weeklyEmissions.get(sortedWeeks[i - 1]) ?? 0;

    if (currentWeekEmissions < previousWeekEmissions) {
      weeksImprovement++;
    } else {
      break; // improvement streak broken
    }
  }

  // 3. Earned achievement badges
  // - Eco Beginner: Logged at least 1 activity
  // - Eco Explorer: Logged at least 5 activities OR currentStreak >= 3
  // - Green Advocate: currentStreak >= 7 OR weeksImprovement >= 1
  // - Eco Champion: currentStreak >= 14 OR weeksImprovement >= 3
  const badges: string[] = [];
  if (activityLog.length >= 1) {
    badges.push("Eco Beginner");
  }
  if (activityLog.length >= 5 || bestStreak >= 3) {
    badges.push("Eco Explorer");
  }
  if (bestStreak >= 7 || weeksImprovement >= 1) {
    badges.push("Green Advocate");
  }
  if (bestStreak >= 14 || weeksImprovement >= 3) {
    badges.push("Eco Champion");
  }

  return {
    currentStreak,
    bestStreak,
    weeksImprovement,
    badges,
  };
}

function getLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}
