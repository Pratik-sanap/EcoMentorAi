// src/app/dashboard/page.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useAppState, useAppDispatch } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";
import { generateRecommendations } from "../../engine/recommendation/recommendationEngine";
import { formatCarbon } from "../../lib/format";
import { ActivityType } from "../../models/activity";
import { generateCoachInsights } from "../../ai/coachEngine";
import { generateWeeklyChallenges, evaluateChallengeProgress } from "../../engine/challenge/challengeEngine";
import { calculateStreakAndBadges } from "../../engine/streak/streakEngine";

// ── Category display config ─────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  [ActivityType.Transport]: "🚗",
  [ActivityType.Food]: "🍔",
  [ActivityType.Energy]: "⚡",
  [ActivityType.Waste]: "🗑️",
  [ActivityType.Shopping]: "🛍️",
};

// ── Component ───────────────────────────────────────────────

export default function DashboardPage() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const {
    activityLog,
    carbonReport: storedReport,
    currentScore: storedScore,
    challenges,
    streakDays,
    bestStreakDays,
    streakWeeksImprovement,
    badges,
  } = state.userProfile;

  const hasActivities = activityLog.length > 0;

  // Streak calculations
  const streakStats = useMemo(() => {
    return calculateStreakAndBadges(activityLog);
  }, [activityLog]);

  // Sync streaks and challenges to state
  useEffect(() => {
    if (
      streakStats.currentStreak !== streakDays ||
      streakStats.bestStreak !== bestStreakDays ||
      streakStats.weeksImprovement !== streakWeeksImprovement ||
      JSON.stringify(streakStats.badges) !== JSON.stringify(badges)
    ) {
      dispatch({
        type: "SET_STREAKS",
        payload: {
          streakDays: streakStats.currentStreak,
          bestStreakDays: streakStats.bestStreak,
          streakWeeksImprovement: streakStats.weeksImprovement,
          badges: streakStats.badges,
        },
      });
    }

    if (!challenges || challenges.length === 0) {
      const generated = generateWeeklyChallenges(state.userProfile);
      dispatch({ type: "SET_CHALLENGES", payload: generated });
    }
  }, [
    streakStats,
    challenges,
    streakDays,
    bestStreakDays,
    streakWeeksImprovement,
    badges,
    dispatch,
    state.userProfile,
  ]);

  // Derive report (prefer stored, fallback to fresh calculation)
  const report = useMemo(() => {
    if (storedReport && hasActivities) return storedReport;
    if (hasActivities) return generateCarbonReport(activityLog);
    return null;
  }, [storedReport, activityLog, hasActivities]);

  // Derive eco score – client-only state with null placeholder for SSR sync
  const [ecoScore, setEcoScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (storedScore !== undefined && storedScore !== null && storedScore > 0 && hasActivities) {
      setEcoScore(storedScore);
    } else if (report && hasActivities) {
      setEcoScore(calculateEcoScore(report, activityLog).score);
    } else {
      setEcoScore(null);
    }
  }, [storedScore, report, activityLog, hasActivities]);

  // Derive eco score level
  const scoreLevel = React.useMemo(() => {
    if (ecoScore === null) return "Loading...";
    if (ecoScore >= 90) return "Eco Champion 🏆";
    if (ecoScore >= 70) return "Eco Aware 🌿";
    if (ecoScore >= 50) return "Improving 📈";
    return "High Impact ⚠️";
  }, [ecoScore]);

  // Derive biggest opportunity
  const biggestOpportunity = React.useMemo(() => {
    if (!report || !hasActivities) return null;
    return generateRecommendations(report, { score: ecoScore ?? 0, scoreLevel: "Improving" as any, improvementPotential: 50 }, activityLog).biggestOpportunity;
  }, [report, ecoScore, hasActivities, activityLog]);

  // Coach insights
  const coachInsights = useMemo(() => {
    const recs = report
      ? generateRecommendations(
          report,
          { score: ecoScore ?? 0, scoreLevel: "Improving" as any, improvementPotential: 50 },
          activityLog
        ).recommendations
      : [];
    return generateCoachInsights(ecoScore ?? 0, report?.topEmissionCategory, recs, activityLog);
  }, [ecoScore, report, activityLog]);

  // Evaluate active challenges
  const activeChallenges = useMemo(() => {
    const list = challenges || [];
    return evaluateChallengeProgress(list, activityLog);
  }, [challenges, activityLog]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-5 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-emerald-600 mb-1">{ecoScore !== null ? ecoScore : '-'}</span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Eco Score</span>
          <span className="text-xs text-gray-400 mt-1">{scoreLevel}</span>
        </div>
        <InfoCard
          icon="📊"
          title="Total Emissions"
          description={report && hasActivities ? formatCarbon(report.totalKgCO2) : "1,200 kg CO₂e (sample)"}
        />
        <InfoCard
          icon="📅"
          title="Monthly Projection"
          description={report && hasActivities ? formatCarbon(report.monthlyProjection) : "1,200 kg CO₂e (sample)"}
        />
        <InfoCard
          icon={report && hasActivities ? CATEGORY_ICONS[report.topEmissionCategory] ?? "🔥" : "🔥"}
          title="Top Category"
          description={report && hasActivities ? report.topEmissionCategory : "Home Energy (sample)"}
        />
      </div>

      {biggestOpportunity && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-emerald-800 mb-1">🌟 Biggest Opportunity: {biggestOpportunity.topEmissionSource}</h2>
            <p className="text-emerald-700">Potential Savings: {biggestOpportunity.estimatedCO2Savings} kg CO₂/month</p>
          </div>
          <div className="hidden sm:block text-emerald-600 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm border border-emerald-100">
            {biggestOpportunity.bestImprovementOpportunity}
          </div>
        </div>
      )}

      {/* Analytics Section — Chart placeholders */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Category Footprint */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Category Footprint</h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] rounded-xl bg-gray-50/50 border border-dashed border-gray-200">
            <span className="text-3xl mb-2">📊</span>
            <p className="text-xs text-gray-400 text-center px-4">Visualization temporarily unavailable.</p>
          </div>
        </div>

        {/* Emissions Breakdown */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Emissions Breakdown</h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] rounded-xl bg-gray-50/50 border border-dashed border-gray-200">
            <span className="text-3xl mb-2">📈</span>
            <p className="text-xs text-gray-400 text-center px-4">Visualization temporarily unavailable.</p>
          </div>
        </div>

        {/* Emissions History */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Emissions History</h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] rounded-xl bg-gray-50/50 border border-dashed border-gray-200">
            <span className="text-3xl mb-2">📉</span>
            <p className="text-xs text-gray-400 text-center px-4">Visualization temporarily unavailable.</p>
          </div>
        </div>

        {/* Score Level */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center justify-center shadow-lg">
          <div className="text-xl font-bold text-green-600">{scoreLevel}</div>
        </div>
      </section>

      {/* Streak, Active Challenge & Coach Insight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Streak */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Streak Status</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-extrabold text-orange-500">{streakDays || 0}</span>
              <span className="text-sm text-gray-500 font-semibold ml-2">Days Streak</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Best Streak: <span className="font-bold text-gray-700">{bestStreakDays || 0} days</span> · Weekly Improvement: <span className="font-bold text-gray-700">{streakWeeksImprovement || 0} weeks</span>
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Earned Badges</div>
            <div className="flex flex-wrap gap-1.5">
              {badges && badges.length > 0 ? (
                badges.map((badge) => (
                  <span key={badge} className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize shadow-sm">
                    🏅 {badge}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-gray-400 italic">No badges earned yet. Log activities to start!</span>
              )}
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Active Challenges</h3>
          {activeChallenges && activeChallenges.length > 0 ? (
            activeChallenges.map((ch) => (
              <div key={ch.id} className="mb-2 p-2 bg-emerald-50 rounded">
                <span className="font-semibold">{ch.title}</span> - {Math.round((ch.currentValue / Math.max(ch.targetValue, 1)) * 100)}%
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No active challenges. Complete tasks to unlock!</p>
          )}
        </div>

        {/* Coach Insights */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Coach Insights</h3>
          {coachInsights ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {coachInsights.weeklySummary && <li>{coachInsights.weeklySummary}</li>}
              {coachInsights.positiveReinforcement && <li>{coachInsights.positiveReinforcement}</li>}
              {coachInsights.biggestImprovementArea && <li>{coachInsights.biggestImprovementArea}</li>}
              {coachInsights.personalizedAdvice && <li>{coachInsights.personalizedAdvice}</li>}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No insights available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
