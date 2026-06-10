// src/app/what-if/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useAppState } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";
import { formatCarbon } from "../../lib/format";

export default function WhatIfPage() {
  const { userProfile } = useAppState();
  const { activityLog } = userProfile;

  const [carReduction, setCarReduction] = useState(0);
  const [trainSwitch, setTrainSwitch] = useState(0);
  const [vegSwitch, setVegSwitch] = useState(0);
  const [electricityReduction, setElectricityReduction] = useState(0);

  // Current baseline
  const currentReport = useMemo(() => {
    return activityLog.length > 0 ? generateCarbonReport(activityLog) : null;
  }, [activityLog]);

  const currentScore = useMemo(() => {
    if (!currentReport) return 68; // fallback
    return calculateEcoScore(currentReport, activityLog).score;
  }, [currentReport, activityLog]);

  // Simulated results
  const { simulatedReport, simulatedScore } = useMemo(() => {
    if (activityLog.length === 0 || !currentReport) {
      return { simulatedReport: null, simulatedScore: currentScore };
    }

    // Clone and modify activity log based on sliders
    const modifiedLog = activityLog.map(activity => {
      let newAmount = activity.amount;

      if (activity.subType === "Car") {
        newAmount = newAmount * (1 - carReduction / 100);
        newAmount = newAmount * (1 - trainSwitch / 100);
      } else if (activity.subType === "Train") {
        // If they switched from car to train, add that amount to train
        // Note: we'd need to find the car amount first, but let's just do a simpler approximation:
        // Assume trainSwitch is a global % switch of total Car to Train, so we don't just add it here easily per activity
      } else if (activity.subType === "Electricity") {
        newAmount = newAmount * (1 - electricityReduction / 100);
      } else if (activity.subType === "Mixed Diet" || activity.subType === "Heavy Meat Diet") {
        // A rough simulation for diet switch
        newAmount = newAmount * (1 - vegSwitch / 100);
      }
      return { ...activity, amount: newAmount };
    });

    // Handle added train and veg amounts separately since we reduced the originals
    let extraTrainAmount = 0;
    let extraVegAmount = 0;
    
    activityLog.forEach(activity => {
      if (activity.subType === "Car") {
        extraTrainAmount += activity.amount * (trainSwitch / 100);
      } else if (activity.subType === "Mixed Diet" || activity.subType === "Heavy Meat Diet") {
        extraVegAmount += activity.amount * (vegSwitch / 100);
      }
    });

    if (extraTrainAmount > 0) {
      modifiedLog.push({ id: "sim-train", type: "Transport" as any, subType: "Train", amount: extraTrainAmount, unit: "km" as any, date: new Date().toISOString() });
    }
    if (extraVegAmount > 0) {
      modifiedLog.push({ id: "sim-veg", type: "Food" as any, subType: "Vegetarian", amount: extraVegAmount, unit: "day" as any, date: new Date().toISOString() });
    }

    const newReport = generateCarbonReport(modifiedLog);
    const newScoreObj = calculateEcoScore(newReport, modifiedLog);

    return { simulatedReport: newReport, simulatedScore: newScoreObj.score };
  }, [activityLog, currentReport, currentScore, carReduction, trainSwitch, vegSwitch, electricityReduction]);

  const currentEmissions = currentReport ? currentReport.monthlyProjection : 0;
  const predictedEmissions = simulatedReport ? simulatedReport.monthlyProjection : 0;
  const savings = Math.max(0, currentEmissions - predictedEmissions);

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
                <label htmlFor="car-slider" className="text-sm font-semibold text-gray-700">
                  Reduce car travel
                </label>
                <span className="text-sm font-bold text-emerald-600">{carReduction}%</span>
              </div>
              <input
                type="range"
                id="car-slider"
                min="0"
                max="100"
                value={carReduction}
                onChange={(e) => setCarReduction(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="train-slider" className="text-sm font-semibold text-gray-700">
                  Switch car to train
                </label>
                <span className="text-sm font-bold text-emerald-600">{trainSwitch}%</span>
              </div>
              <input
                type="range"
                id="train-slider"
                min="0"
                max="100"
                value={trainSwitch}
                onChange={(e) => setTrainSwitch(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="veg-slider" className="text-sm font-semibold text-gray-700">
                  Switch to vegetarian diet
                </label>
                <span className="text-sm font-bold text-emerald-600">{vegSwitch}%</span>
              </div>
              <input
                type="range"
                id="veg-slider"
                min="0"
                max="100"
                value={vegSwitch}
                onChange={(e) => setVegSwitch(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 4 */}
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="elec-slider" className="text-sm font-semibold text-gray-700">
                  Reduce electricity usage
                </label>
                <span className="text-sm font-bold text-emerald-600">{electricityReduction}%</span>
              </div>
              <input
                type="range"
                id="elec-slider"
                min="0"
                max="100"
                value={electricityReduction}
                onChange={(e) => setElectricityReduction(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </section>

        {/* Results Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4">Simulated Impact</h3>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-emerald-100 uppercase tracking-wider">Current Emissions</span>
              <span className="font-semibold">{currentEmissions.toFixed(0)} kg CO₂e</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-emerald-100 uppercase tracking-wider">Predicted Emissions</span>
              <span className="font-semibold">{predictedEmissions.toFixed(0)} kg CO₂e</span>
            </div>
            
            <div className="border-t border-emerald-400 pt-4 mb-4">
              <div className="text-xs text-emerald-100 uppercase tracking-wider mb-2">Monthly Savings</div>
              <div className="text-4xl font-extrabold text-white">
                {savings.toFixed(0)} kg
              </div>
            </div>

            <div className="bg-white/20 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm font-semibold">New Eco Score</span>
              <span className="text-xl font-bold bg-white text-teal-600 px-3 py-1 rounded-full">{simulatedScore}</span>
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
