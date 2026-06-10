// src/app/dashboard/page.tsx
"use client";

import React from "react";
import { ScoreCard } from "../../components/ScoreCard";
import { InfoCard } from "../../components/InfoCard";
import { DonutChart } from "../../charts/DonutChart";
import { LineChart } from "../../charts/LineChart";
import { BarChart } from "../../charts/BarChart";

export default function DashboardPage() {
  // Mock data for charts
  const donutData = [
    { name: "Transportation", value: 320, color: "#3b82f6" },
    { name: "Food & Diet", value: 210, color: "#10b981" },
    { name: "Home Energy", value: 450, color: "#f59e0b" },
    { name: "Waste Management", value: 90, color: "#ef4444" },
    { name: "Shopping & Goods", value: 130, color: "#8b5cf6" },
  ];

  const lineData = [
    { date: "Week 1", emissions: 1450 },
    { date: "Week 2", emissions: 1380 },
    { date: "Week 3", emissions: 1250 },
    { date: "Week 4", emissions: 1200 },
  ];

  const barData = [
    { name: "Transport", actual: 320, target: 250 },
    { name: "Food", actual: 210, target: 180 },
    { name: "Energy", actual: 450, target: 350 },
    { name: "Waste", actual: 90, target: 100 },
    { name: "Shopping", actual: 130, target: 110 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600">
          Visualize your footprint progress, review carbon score metrics, and analyze carbon category breakdowns.
        </p>
      </div>

      {/* Hero & Score section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 flex flex-col justify-between">
          <ScoreCard score={68} caption="Your Carbon Score (0-100)" />
          <div className="mt-4">
            <InfoCard
              title="Weekly Goal Status"
              description="You are currently on track to hit your reduction target for this week. Keep up the good work!"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Category Footprint Comparison</h2>
            <p className="text-sm text-gray-500 mb-4">Actual vs Target Emissions (kg CO₂e)</p>
          </div>
          <BarChart data={barData} />
        </div>
      </div>

      {/* Analytics breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Emissions Breakdown</h2>
          <p className="text-sm text-gray-500 mb-4">Current distribution by sector</p>
          <DonutChart data={donutData} />
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Emissions History</h2>
          <p className="text-sm text-gray-500 mb-4">Emissions progress over the last month (kg CO₂e)</p>
          <LineChart data={lineData} />
        </div>
      </div>
    </div>
  );
}
