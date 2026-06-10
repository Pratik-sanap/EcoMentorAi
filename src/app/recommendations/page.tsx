// src/app/recommendations/page.tsx
"use client";

import React, { useMemo } from "react";
import { useAppState } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";
import { generateRecommendations } from "../../engine/recommendation/recommendationEngine";
import { RecCategory } from "../../models/recommendation";

const ICONS: Record<string, string> = {
  [RecCategory.Transportation]: "🚗",
  [RecCategory.Food]: "🥗",
  [RecCategory.Energy]: "⚡",
  [RecCategory.Waste]: "🗑️",
  [RecCategory.Lifestyle]: "🌿",
};

export default function RecommendationsPage() {
  const state = useAppState();
  const { activityLog, carbonReport: storedReport, currentScore: storedScore } = state.userProfile;

  const hasActivities = activityLog.length > 0;

  const report = useMemo(() => {
    if (storedReport && hasActivities) return storedReport;
    if (hasActivities) return generateCarbonReport(activityLog);
    return null;
  }, [storedReport, activityLog, hasActivities]);

  const ecoScore = useMemo(() => {
    if (storedScore !== undefined && hasActivities) {
      return { score: storedScore, scoreLevel: "Improving" as any, improvementPotential: 50 }; // Simplified since we don't have full EcoScore from state
    }
    if (report && hasActivities) {
      return calculateEcoScore(report, activityLog);
    }
    return { score: 68, scoreLevel: "Improving" as any, improvementPotential: 32 }; 
  }, [storedScore, report, activityLog, hasActivities]);

  const { biggestOpportunity, recommendations } = useMemo(() => {
    if (!report) return { biggestOpportunity: null, recommendations: [] };
    return generateRecommendations(report, ecoScore, activityLog);
  }, [report, ecoScore, activityLog]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          Personalized Recommendations
        </h1>
        <p className="text-gray-600">
          Discover customized actions you can take today to reduce your carbon footprint and make a difference.
        </p>
      </div>

      {!hasActivities && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-700">
            Log some activities in the Calculator to see your personalized recommendations!
          </p>
        </div>
      )}

      {biggestOpportunity && (
        <div className="mb-8 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-800 mb-2">🔥 Biggest Opportunity: {biggestOpportunity.topEmissionSource}</h2>
          <p className="text-emerald-700 font-medium mb-2">{biggestOpportunity.bestImprovementOpportunity}</p>
          <p className="text-sm text-emerald-600 mb-4">{biggestOpportunity.personalizedExplanation}</p>
          <div className="flex gap-4">
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Savings: {biggestOpportunity.estimatedCO2Savings} kg CO₂e / month
            </span>
            <span className="text-xs font-semibold bg-white text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full">
              Difficulty: {biggestOpportunity.difficultyLevel}
            </span>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <InfoCard
            key={rec.id}
            icon={ICONS[rec.category] || "💡"}
            title={`${rec.title} (${rec.category})`}
            description={rec.description}
            action={
              <div className="flex items-center justify-between w-full mt-4 gap-4 border-t border-gray-100 pt-3">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Estimated saving: {rec.impactKgCO2} kg CO₂e
                </span>
                <PrimaryButton className="text-xs py-1 px-3 opacity-70 cursor-not-allowed" disabled>
                  Accept Action
                </PrimaryButton>
              </div>
            }
          />
        ))}
      </section>
    </div>
  );
}
