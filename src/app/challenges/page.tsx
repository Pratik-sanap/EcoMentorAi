// src/app/challenges/page.tsx
"use client";

import React from "react";
import { InfoCard } from "../../components/InfoCard";
import { ProgressBar } from "../../components/ProgressBar";

export default function ChallengesPage() {
  const challenges = [
    {
      id: "chal-1",
      title: "Transit Commuter",
      category: "Transport",
      description: "Commute via train or bus instead of driving your car 5 times this week.",
      currentValue: 3,
      targetValue: 5,
      unit: "trips",
      points: 50,
      icon: "🚍",
    },
    {
      id: "chal-2",
      title: "Zero Waste Hero",
      category: "Waste Management",
      description: "Successfully compost all organic food waste for 7 consecutive days.",
      currentValue: 5,
      targetValue: 7,
      unit: "days",
      points: 75,
      icon: "🍎",
    },
    {
      id: "chal-3",
      title: "Vampire Power Cut",
      category: "Energy",
      description: "Unplug 4 idle household electronics when they are not in active use.",
      currentValue: 2,
      targetValue: 4,
      unit: "devices",
      points: 40,
      icon: "🔌",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
            Weekly Eco Challenges
          </h1>
          <p className="text-gray-600">
            Join gamified sustainability challenges, compete with peers, and maintain your green streak.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 flex items-center gap-3 self-start">
          <span className="text-2xl" role="img" aria-label="Streak">🔥</span>
          <div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Streak</div>
            <div className="text-lg font-extrabold text-emerald-700">4 Weeks Active</div>
          </div>
        </div>
      </div>

      {/* Challenges Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((chal) => (
          <InfoCard
            key={chal.id}
            icon={chal.icon}
            title={chal.title}
            description={chal.description}
            action={
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
                <ProgressBar
                  value={chal.currentValue}
                  max={chal.targetValue}
                  label={`Progress (${chal.currentValue}/${chal.targetValue} ${chal.unit})`}
                />
                <div className="flex justify-between items-center text-xs font-semibold mt-1">
                  <span className="text-gray-500">+{chal.points} Points</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">
                    {chal.category}
                  </span>
                </div>
              </div>
            }
          />
        ))}
      </section>
    </div>
  );
}
