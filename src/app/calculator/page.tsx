// src/app/calculator/page.tsx
"use client";

import React from "react";
import { InfoCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function CalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          Carbon Footprint Calculator
        </h1>
        <p className="text-gray-600">
          Log your daily activities across key categories to calculate and track your environmental footprint.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <InfoCard
          icon="🚗"
          title="Transport Log"
          description="Log daily mileage, public transport journeys, and travel modes."
        />
        <InfoCard
          icon="🍔"
          title="Food Habits"
          description="Track dietary choices, red meat consumption, and organic meals."
        />
        <InfoCard
          icon="⚡"
          title="Energy & Utility"
          description="Log household electricity usage, heating energy, and water consumption."
        />
      </div>

      {/* Activity Input Section Placeholder */}
      <section className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Activity Log</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="activity-type" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Category
              </label>
              <select
                id="activity-type"
                defaultValue="transport"
                className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2 text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none"
                disabled
              >
                <option value="transport">Transportation</option>
                <option value="food">Food & Meals</option>
                <option value="energy">Utilities & Energy</option>
                <option value="waste">Waste Management</option>
              </select>
            </div>
            <div>
              <label htmlFor="activity-value" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Amount
              </label>
              <div className="flex rounded-lg shadow-sm">
                <input
                  type="number"
                  id="activity-value"
                  placeholder="e.g. 15"
                  className="w-full rounded-l-lg border border-gray-300 bg-white/70 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:outline-none"
                  disabled
                />
                <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                  units
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200/50 pt-4 flex justify-end">
            <PrimaryButton className="opacity-70 cursor-not-allowed" disabled>
              Add Activity Log
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
