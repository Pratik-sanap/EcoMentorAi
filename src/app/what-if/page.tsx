// src/app/what-if/page.tsx
"use client";

import React, { useState } from "react";
import { InfoCard } from "../../components/InfoCard";

export default function WhatIfPage() {
  const [dietPercent, setDietPercent] = useState(20);
  const [commutePercent, setCommutePercent] = useState(10);
  const [heatingTemp, setHeatingTemp] = useState(21);

  // Simple hardcoded linear simulation values
  const simulatedSavings = Math.round(
    (dietPercent * 4.5) + (commutePercent * 8.2) + ((22 - heatingTemp) * 120)
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          What-If Simulator
        </h1>
        <p className="text-gray-600">
          Simulate changes in your lifestyle habits to visualize potential footprint reductions before making real changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulation Panel */}
        <section className="lg:col-span-2 bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Adjust Lifestyle Adjustments</h2>
          
          <div className="space-y-6">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="diet-slider" className="text-sm font-semibold text-gray-700">
                  Plant-Based Diet Portion
                </label>
                <span className="text-sm font-bold text-emerald-600">{dietPercent}%</span>
              </div>
              <input
                type="range"
                id="diet-slider"
                min="0"
                max="100"
                value={dietPercent}
                onChange={(e) => setDietPercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of weekly meals replacing meat/dairy with plants.</p>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="commute-slider" className="text-sm font-semibold text-gray-700">
                  Active or Transit Commuting
                </label>
                <span className="text-sm font-bold text-emerald-600">{commutePercent}%</span>
              </div>
              <input
                type="range"
                id="commute-slider"
                min="0"
                max="100"
                value={commutePercent}
                onChange={(e) => setCommutePercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Percentage of car commutes replaced by walking, biking, or transit.</p>
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="temp-slider" className="text-sm font-semibold text-gray-700">
                  Thermostat Temperature (Heating)
                </label>
                <span className="text-sm font-bold text-emerald-600">{heatingTemp}°C</span>
              </div>
              <input
                type="range"
                id="temp-slider"
                min="16"
                max="24"
                step="0.5"
                value={heatingTemp}
                onChange={(e) => setHeatingTemp(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">Average indoor winter heating target temperature setting.</p>
            </div>
          </div>
        </section>

        {/* Results Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-1">Simulated Impact</h3>
            <div className="text-xs text-emerald-100 uppercase tracking-wider mb-4">Estimated Monthly Savings</div>
            <div className="text-4xl font-extrabold mb-2">
              {simulatedSavings > 0 ? `-${simulatedSavings}` : "0"} kg
            </div>
            <div className="text-sm text-emerald-500 bg-white/95 px-3 py-1.5 rounded-xl text-center font-bold">
              Carbon Saved in CO₂e
            </div>
          </div>

          <InfoCard
            title="Why Use What-If?"
            description="Our simulator helps you find the most high-impact adjustments specific to your lifestyle habits before you adopt them."
          />
        </aside>
      </div>
    </div>
  );
}
