// src/app/dashboard/page.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { useAppState, useAppDispatch } from "../../lib/state";
import { ScoreCard } from "../../components/ScoreCard";
import { InfoCard } from "../../components/InfoCard";
import dynamic from 'next/dynamic';
const DonutChart = dynamic(() => import('../../charts/DonutChart').then(mod => mod.DonutChart), { ssr: false });
const BarChart = dynamic(() => import('../../charts/BarChart').then(mod => mod.BarChart), { ssr: false });
const LineChart = dynamic(() => import('../../charts/LineChart').then(mod => mod.LineChart), { ssr: false });
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";
import { generateRecommendations } from "../../engine/recommendation/recommendationEngine";
import { formatCarbon, formatNumber } from "../../lib/format";
import { ActivityType } from "../../models/activity";
import { EMISSION_FACTORS } from "../../engine/carbon/emissionFactors";
import { generateCoachInsights } from "../../ai/coachEngine";
import { generateWeeklyChallenges, evaluateChallengeProgress } from "../../engine/challenge/challengeEngine";
import { calculateStreakAndBadges } from "../../engine/streak/streakEngine";
import type { DonutChartDataItem } from "../../charts/DonutChart";
import type { LineChartDataItem } from "../../charts/LineChart";
import type { BarChartDataItem } from "../../charts/BarChart";

// ── Category display config ─────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  [ActivityType.Transport]: "#3b82f6",
  [ActivityType.Food]: "#10b981",
  [ActivityType.Energy]: "#f59e0b",
  [ActivityType.Waste]: "#ef4444",
  [ActivityType.Shopping]: "#8b5cf6",
};

const CATEGORY_ICONS: Record<string, string> = {
  [ActivityType.Transport]: "🚗",
  [ActivityType.Food]: "🍔",
  [ActivityType.Energy]: "⚡",
  [ActivityType.Waste]: "🗑️",
  [ActivityType.Shopping]: "🛍️",
};

/** Target benchmarks per category in kg CO₂/month (aspirational goals) */
const CATEGORY_TARGETS: Record<string, number> = {
  [ActivityType.Transport]: 250,
  [ActivityType.Food]: 180,
  [ActivityType.Energy]: 350,
  [ActivityType.Waste]: 100,
  [ActivityType.Shopping]: 110,
};

// ── Mock / fallback data ────────────────────────────────────

const MOCK_DONUT_DATA: DonutChartDataItem[] = [
  { name: "Transportation", value: 320, color: "#3b82f6" },
  { name: "Food & Diet", value: 210, color: "#10b981" },
  { name: "Home Energy", value: 450, color: "#f59e0b" },
  { name: "Waste Management", value: 90, color: "#ef4444" },
  { name: "Shopping & Goods", value: 130, color: "#8b5cf6" },
];

const MOCK_LINE_DATA: LineChartDataItem[] = [
  { date: "Week 1", emissions: 1450 },
  { date: "Week 2", emissions: 1380 },
  { date: "Week 3", emissions: 1250 },
  { date: "Week 4", emissions: 1200 },
];

const MOCK_BAR_DATA: BarChartDataItem[] = [
  { name: "Transport", actual: 320, target: 250 },
  { name: "Food", actual: 210, target: 180 },
  { name: "Energy", actual: 450, target: 350 },
  { name: "Waste", actual: 90, target: 100 },
  { name: "Shopping", actual: 130, target: 110 },
];

// ── Helper: group activities into weekly emission trend ──────

const buildWeeklyTrend = (
  activities: { date: string; emission: number }[]
): LineChartDataItem[] => {
  if (activities.length === 0) return MOCK_LINE_DATA;

  // Sort by date
  const sorted = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group into weeks
  const weekMap = new Map<string, number>();
  for (const item of sorted) {
    const d = new Date(item.date);
    // Calculate ISO week start (Monday)
    const dayOfWeek = d.getDay();
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(d.setDate(diff));
    const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    weekMap.set(weekLabel, (weekMap.get(weekLabel) ?? 0) + item.emission);
  }

  const trend: LineChartDataItem[] = [];
  for (const [date, emissions] of weekMap) {
    trend.push({ date, emissions: Math.round(emissions * 100) / 100 });
  }

  return trend.length > 0 ? trend : MOCK_LINE_DATA;
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

  // Derive report (prefer stored, fallback to fresh calculation or mock)
  const report = useMemo(() => {
    if (storedReport && hasActivities) return storedReport;
    if (hasActivities) return generateCarbonReport(activityLog);
    return null;
  }, [storedReport, activityLog, hasActivities]);

  // Derive eco score – client‑only state with null placeholder to keep server & client sync
  const [ecoScore, setEcoScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (storedScore !== undefined && hasActivities) {
      setEcoScore(storedScore);
    } else if (report && hasActivities) {
      setEcoScore(calculateEcoScore(report, activityLog).score);
    } else {
      setEcoScore(null); // fallback default when no data
    }
  }, [storedScore, report, activityLog, hasActivities]);


  // Derive eco score level – depends on ecoScore state, placeholder when null
  const scoreLevel = React.useMemo(() => {
    if (ecoScore === null) return "Loading...";
    if (ecoScore >= 90) return "Eco Champion 🏆";
    if (ecoScore >= 70) return "Eco Aware 🌿";
    if (ecoScore >= 50) return "Improving 📈";
    return "High Impact ⚠️";
  }, [ecoScore]);

  // Derive biggest opportunity – avoid rendering before ecoScore ready
  const biggestOpportunity = React.useMemo(() => {
    if (!report || !hasActivities) return null;
    return generateRecommendations(report, { score: ecoScore, scoreLevel: "Improving" as any, improvementPotential: 50 }, activityLog).biggestOpportunity;
  }, [report, ecoScore, hasActivities, activityLog]);

// Build donut chart data
  const donutData: DonutChartDataItem[] = useMemo(() => {
    // Requirements: Donut chart must show Transport, Food, Energy, Waste.
    // If hasActivities is true, we compute actual values.
    // If a required category has 0 emissions, we still list it (or fallback dynamically) to keep the container populated.
    // Let's build a map with all 4 required categories.
    const categoriesToShow = [
      ActivityType.Transport,
      ActivityType.Food,
      ActivityType.Energy,
      ActivityType.Waste,
    ];

    if (!hasActivities || !report) {
      // Meaningful derived visualization fallback if insufficient data exists
      return categoriesToShow.map((cat) => ({
        name: cat,
        value: CATEGORY_TARGETS[cat] || 100, // Derived average target values
        color: CATEGORY_COLORS[cat] ?? "#6b7280",
      }));
    }

    return categoriesToShow.map((cat) => {
      const val = report.breakdown[cat] ?? 0;
      return {
        name: cat,
        value: val > 0 ? Math.round(val * 100) / 100 : 0.01, // fallback to a tiny value if 0, or just render it
        color: CATEGORY_COLORS[cat] ?? "#6b7280",
      };
    });
  }, [report, hasActivities]);
  console.log('Donut chart data:', donutData);

  // Build bar chart data (actual vs target)
  const barData: BarChartDataItem[] = useMemo(() => {
    const categoriesToShow = [
      ActivityType.Transport,
      ActivityType.Food,
      ActivityType.Energy,
      ActivityType.Waste,
    ];

    if (!hasActivities || !report) {
      // Fallback behavior: derived visualization from default targets and a fraction representing "no data logged"
      return categoriesToShow.map((cat) => ({
        name: cat,
        actual: 0, // show 0 vs target
        target: CATEGORY_TARGETS[cat] ?? 200,
      }));
    }

    return categoriesToShow.map((cat) => {
      const val = report.breakdown[cat] ?? 0;
      return {
        name: cat,
        actual: Math.round(val * 100) / 100,
        target: CATEGORY_TARGETS[cat] ?? 200,
      };
    });
  }, [report, hasActivities]);
  console.log('Bar chart data:', barData);

  // Build line chart data (weekly trend)
  const lineData: LineChartDataItem[] = useMemo(() => {
    if (!hasActivities) {
      // Fallback: Use standard progress trend representing targets
      return MOCK_LINE_DATA;
    }

    const emissionsByActivity = activityLog.map((a) => {
      const factor = EMISSION_FACTORS[a.subType];
      return {
        date: a.date,
        emission: a.amount * (factor?.kgCO2PerUnit ?? 0),
      };
    });

    return buildWeeklyTrend(emissionsByActivity);
  }, [activityLog, hasActivities]);
  console.log('Line chart data:', lineData);

  // Coach insights
  const coachInsights = useMemo(() => {
    const recs = report
      ? generateRecommendations(
          report,
          { score: ecoScore, scoreLevel: "Improving" as any, improvementPotential: 50 },
          activityLog
        ).recommendations
      : [];
    return generateCoachInsights(ecoScore, report?.topEmissionCategory, recs, activityLog);
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
      {/* Analytics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Category Footprint Comparison */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Category Footprint</h3>
          {donutData && donutData.length ? (
            <DonutChart data={donutData} height={220} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
              No category data available
            </div>
          )}
        </div>

        {/* Emissions Breakdown */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Emissions Breakdown</h3>
          {barData && barData.length ? (
            <BarChart data={barData} height={220} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
              No emissions breakdown data
            </div>
          )}
        </div>

        {/* Emissions History */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Emissions History</h3>
          {lineData && lineData.length ? (
            <LineChart data={lineData} height={220} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-400 text-sm">
              No emissions history data
            </div>
          )}
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
            <p className="text-xs text-gray-550 mb-4">
              Best Streak: <span className="font-bold text-gray-700">{bestStreakDays || 0} days</span> · Weekly Improvement: <span className="font-bold text-gray-700">{streakWeeksImprovement || 0} weeks</span>
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Earned Badges</div>
            <div className="flex flex-wrap gap-1.5">
              {badges && badges.length > 0 ? (
                badges.map((badge) => (
                  <span key={badge} className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-55 text-emerald-700 border border-emerald-150 capitalize shadow-sm">
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
                <span className="font-semibold">{ch.title}</span> - {ch.progress}%
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No active challenges. Complete tasks to unlock!</p>
          )}
        </div>
        {/* Coach Insights */}
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Coach Insights</h3>
          {coachInsights && coachInsights.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {coachInsights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No insights available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
