// src/app/recommendations/page.tsx
"use client";

import React from "react";
import { InfoCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function RecommendationsPage() {
  const recommendations = [
    {
      id: "rec-1",
      title: "Transition to LED lighting",
      category: "Energy",
      description: "Replace high-wattage incandescent light bulbs with energy-efficient LED bulbs. This can save up to 75% on lighting energy.",
      impact: "45 kg CO₂e / year",
      icon: "💡",
    },
    {
      id: "rec-2",
      title: "Initiate Meat-Free Mondays",
      category: "Food & Diet",
      description: "Choose plant-based alternatives once a week. Skipping beef and pork can significantly reduce farming and transport emissions.",
      impact: "180 kg CO₂e / year",
      icon: "🥗",
    },
    {
      id: "rec-3",
      title: "Opt for Active Transportation",
      category: "Transport",
      description: "Bicycle, run, or walk for journeys under 5km rather than driving alone. Great for physical health and zero carbon emissions.",
      impact: "320 kg CO₂e / year",
      icon: "🚲",
    },
    {
      id: "rec-4",
      title: "Eliminate Single-Use Plastics",
      category: "Waste Management",
      description: "Switch to reusable carrier bags, water bottles, and food containers to reduce landfill waste and plastic packaging production.",
      impact: "24 kg CO₂e / year",
      icon: "🥤",
    },
  ];

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

      {/* Recommendations Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <InfoCard
            key={rec.id}
            icon={rec.icon}
            title={`${rec.title} (${rec.category})`}
            description={rec.description}
            action={
              <div className="flex items-center justify-between w-full mt-4 gap-4 border-t border-gray-100 pt-3">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Estimated saving: {rec.impact}
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
