// src/app/challenges/page.tsx
"use client";

import React from "react";
import { useAppState, useAppDispatch } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { ProgressBar } from "../../components/ProgressBar";
import { generateWeeklyChallenges, evaluateChallengeProgress } from "../../engine/challenge/challengeEngine";
import { calculateStreakAndBadges } from "../../engine/streak/streakEngine";

export default function ChallengesPage() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const { activityLog, challenges, streakDays, bestStreakDays, streakWeeksImprovement, badges } = state.userProfile;

  // Calculate streaks and badges on the fly
  const streakStats = React.useMemo(() => {
    return calculateStreakAndBadges(activityLog);
  }, [activityLog]);

  // Evaluate active challenges progress against current activities
  const activeChallenges = React.useMemo(() => {
    const list = challenges || [];
    return evaluateChallengeProgress(list, activityLog);
  }, [challenges, activityLog]);

  // Automatically initialize challenges if empty
  React.useEffect(() => {
    if (!challenges || challenges.length === 0) {
      const generated = generateWeeklyChallenges(state.userProfile);
      dispatch({ type: "SET_CHALLENGES", payload: generated });
    }
  }, [challenges, dispatch, state.userProfile]);

  const handleRegenerate = () => {
    const generated = generateWeeklyChallenges(state.userProfile);
    dispatch({ type: "SET_CHALLENGES", payload: generated });
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "hard":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-750 border-gray-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header section with Streak stats */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
            Weekly Eco Challenges
          </h1>
          <p className="text-gray-600">
            Join gamified sustainability challenges, compete with peers, and maintain your green streak.
          </p>
        </div>
        
        {/* Streak & Improvement Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Streak">🔥</span>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Logging Streak</div>
              <div className="text-lg font-extrabold text-orange-700">{streakDays || 0} Days Active</div>
              <div className="text-[10px] text-gray-400">Best: {bestStreakDays || 0} days</div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="Improvement Weeks">📈</span>
            <div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Weekly Progress</div>
              <div className="text-lg font-extrabold text-emerald-700">
                {streakWeeksImprovement || 0} Weeks Better
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Panel */}
      <section className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-805 mb-4">🏆 Achievement Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: "Eco Beginner", desc: "Log 1st activity", icon: "🌱" },
            { name: "Eco Explorer", desc: "3 days logging", icon: "🧭" },
            { name: "Green Advocate", desc: "7 days logging / 1 week up", icon: "🌿" },
            { name: "Eco Champion", desc: "14 days logging / 3 weeks up", icon: "🏆" },
          ].map((b) => {
            const hasBadge = badges?.includes(b.name);
            return (
              <div
                key={b.name}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition ${
                  hasBadge
                    ? "bg-white/70 border-emerald-200 shadow-sm"
                    : "bg-gray-50/40 border-gray-200/50 opacity-40"
                }`}
              >
                <span className="text-3xl mb-2">{b.icon}</span>
                <span className="text-xs font-bold text-gray-800">{b.name}</span>
                <span className="text-[9px] text-gray-450 mt-1">{b.desc}</span>
                {hasBadge && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-2">
                    Unlocked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Challenge Control Row */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Active Challenges</h2>
        <button
          onClick={handleRegenerate}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition border border-emerald-100"
        >
          🔄 Get New Weekly Challenges
        </button>
      </div>

      {/* Challenges Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeChallenges.length > 0 ? (
          activeChallenges.map((chal) => (
            <InfoCard
              key={chal.id}
              icon={chal.isCompleted ? "✅" : "🎯"}
              title={chal.title}
              description={chal.description}
              action={
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
                  <ProgressBar
                    value={chal.currentValue}
                    max={chal.targetValue}
                    label={`Progress (${chal.currentValue}/${chal.targetValue})`}
                  />
                  <div className="flex flex-wrap gap-2 items-center justify-between mt-1 text-xs">
                    <span className="font-semibold text-gray-500">+{chal.points} Points</span>
                    <span className="font-bold text-emerald-600">
                      -{chal.estimatedCO2Savings} kg CO₂
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold capitalize ${getDifficultyColor(chal.difficulty)}`}>
                      {chal.difficulty}
                    </span>
                  </div>
                </div>
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white/40 border border-white/20 rounded-2xl">
            <p className="text-gray-400 italic">No challenges generated. Click "Get New Weekly Challenges" to start!</p>
          </div>
        )}
      </section>
    </div>
  );
}
