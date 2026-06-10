// src/app/profile/page.tsx
"use client";

import React from "react";
import { InfoCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function ProfilePage() {
  const categories = [
    { key: "transport", name: "Transportation Tracking", description: "Enable vehicle logs, public transit, and commute tracking." },
    { key: "food", name: "Food & Diet Logs", description: "Log meals, beef consumption, and dairy intake." },
    { key: "energy", name: "Utility & Energy Use", description: "Include household electricity, natural gas, and water inputs." },
    { key: "waste", name: "Waste Management", description: "Log recycling quantities, organic composting, and landfill waste." },
    { key: "shopping", name: "Shopping & Retail Habits", description: "Track new purchase emissions, electronics, and fast-fashion impact." },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          User Profile & Preferences
        </h1>
        <p className="text-gray-600">
          Manage your tracking preferences, reset application storage, and view your eco profile metadata.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          title="Account Details"
          description="View your unique system identifier."
          action={
            <div className="mt-2 text-xs font-mono text-gray-500 break-all">
              UID: 1c6242f7-d9d1-4bf3-bfb9-78d3a7e9d243
            </div>
          }
        />
        <InfoCard
          title="Score Overview"
          description="Your current carbon score rating is calculated at 68."
        />
        <InfoCard
          title="Streak Status"
          description="You are currently maintaining a 4-week active eco streak."
        />
      </div>

      {/* Preferences Section Placeholder */}
      <section className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Tracking Preferences</h2>
        <p className="text-sm text-gray-500 mb-6">Customize which categories are included in your carbon footprint score calculations.</p>
        
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.key} className="flex items-start justify-between p-3 rounded-xl hover:bg-white/20 transition-colors">
              <div className="mr-4">
                <div className="text-sm font-semibold text-gray-800">{cat.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{cat.description}</div>
              </div>
              <button
                type="button"
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed rounded-full border-2 border-transparent bg-emerald-600 transition-colors duration-200 ease-in-out"
                disabled
              >
                <span className="pointer-events-none inline-block h-5 w-5 transform translate-x-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200/50 pt-6 mt-6 flex justify-between items-center">
          <PrimaryButton className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100/50">
            Reset Data
          </PrimaryButton>
          <PrimaryButton className="opacity-70 cursor-not-allowed" disabled>
            Save Settings
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
