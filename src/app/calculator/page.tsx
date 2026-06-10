// src/app/calculator/page.tsx
"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useAppState, useAppDispatch } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { PrimaryButton } from "../../components/PrimaryButton";
import {
  ActivityType,
  ActivitySubType,
  TransportMode,
  FoodDiet,
  Unit,
  Activity,
} from "../../models/activity";
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";
import { EMISSION_FACTORS } from "../../engine/carbon/emissionFactors";
import { formatCarbon } from "../../lib/format";
import { formatRelativeDate } from "../../lib/date";

// ── Category → Sub-type mappings ────────────────────────────

interface SubTypeOption {
  value: ActivitySubType;
  label: string;
  unit: Unit;
  unitLabel: string;
}

const TRANSPORT_OPTIONS: SubTypeOption[] = [
  { value: "Car", label: "🚗 Car", unit: Unit.Km, unitLabel: "km" },
  { value: "Bus", label: "🚌 Bus", unit: Unit.Km, unitLabel: "km" },
  { value: "Train", label: "🚆 Train", unit: Unit.Km, unitLabel: "km" },
  { value: "Bike", label: "🚲 Bike", unit: Unit.Km, unitLabel: "km" },
  { value: "Walking", label: "🚶 Walking", unit: Unit.Km, unitLabel: "km" },
];

const FOOD_OPTIONS: SubTypeOption[] = [
  { value: "Vegetarian", label: "🥗 Vegetarian", unit: Unit.Day, unitLabel: "days" },
  { value: "Mixed Diet", label: "🍽️ Mixed Diet", unit: Unit.Day, unitLabel: "days" },
  { value: "Heavy Meat Diet", label: "🥩 Heavy Meat Diet", unit: Unit.Day, unitLabel: "days" },
];

const ENERGY_OPTIONS: SubTypeOption[] = [
  { value: "Electricity", label: "⚡ Electricity", unit: Unit.Kwh, unitLabel: "kWh" },
];

const WASTE_OPTIONS: SubTypeOption[] = [
  { value: "Waste", label: "🗑️ Waste Generated", unit: Unit.Kg, unitLabel: "kg" },
];

const CATEGORY_OPTIONS: { value: ActivityType; label: string; icon: string }[] = [
  { value: ActivityType.Transport, label: "Transportation", icon: "🚗" },
  { value: ActivityType.Food, label: "Food & Diet", icon: "🍔" },
  { value: ActivityType.Energy, label: "Energy & Utilities", icon: "⚡" },
  { value: ActivityType.Waste, label: "Waste Management", icon: "🗑️" },
];

const getSubTypeOptions = (category: ActivityType): SubTypeOption[] => {
  switch (category) {
    case ActivityType.Transport:
      return TRANSPORT_OPTIONS;
    case ActivityType.Food:
      return FOOD_OPTIONS;
    case ActivityType.Energy:
      return ENERGY_OPTIONS;
    case ActivityType.Waste:
      return WASTE_OPTIONS;
    default:
      return [];
  }
};

// ── Component ───────────────────────────────────────────────

export default function CalculatorPage() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const [selectedCategory, setSelectedCategory] = useState<ActivityType>(ActivityType.Transport);
  const [selectedSubType, setSelectedSubType] = useState<ActivitySubType>("Car");
  const [amount, setAmount] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);

  const subTypeOptions = useMemo(() => getSubTypeOptions(selectedCategory), [selectedCategory]);
  const currentOption = useMemo(
    () => subTypeOptions.find((o) => o.value === selectedSubType) ?? subTypeOptions[0],
    [subTypeOptions, selectedSubType]
  );

  // Live emission preview
  const previewEmission = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return 0;
    const factor = EMISSION_FACTORS[selectedSubType];
    return Math.round(numAmount * factor.kgCO2PerUnit * 100) / 100;
  }, [amount, selectedSubType]);

  const handleCategoryChange = useCallback(
    (category: ActivityType) => {
      setSelectedCategory(category);
      const options = getSubTypeOptions(category);
      if (options.length > 0) {
        setSelectedSubType(options[0].value);
      }
    },
    []
  );

  const handleAddActivity = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const activity: Activity = {
      id: crypto.randomUUID(),
      type: selectedCategory,
      subType: selectedSubType,
      amount: numAmount,
      unit: currentOption.unit,
      date: new Date().toISOString(),
    };

    // 1. Add to state
    dispatch({ type: "ADD_ACTIVITY", payload: activity });

    // 2. Recalculate report with the new activity included
    const updatedActivities = [...state.userProfile.activityLog, activity];
    const report = generateCarbonReport(updatedActivities);
    dispatch({ type: "SET_CARBON_REPORT", payload: report });

    // 3. Recalculate eco score
    const ecoScore = calculateEcoScore(report, updatedActivities);
    dispatch({ type: "SET_CURRENT_SCORE", payload: ecoScore.score });

    // 4. Update last calculated timestamp
    dispatch({ type: "SET_LAST_CALCULATED_AT", payload: new Date().toISOString() });

    // 5. Reset form & show success
    setAmount("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [amount, selectedCategory, selectedSubType, currentOption, dispatch, state.userProfile.activityLog]);

  const handleRemoveActivity = useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE_ACTIVITY", payload: id });

      const updatedActivities = state.userProfile.activityLog.filter((a) => a.id !== id);
      const report = generateCarbonReport(updatedActivities);
      dispatch({ type: "SET_CARBON_REPORT", payload: report });

      const ecoScore = calculateEcoScore(report, updatedActivities);
      dispatch({ type: "SET_CURRENT_SCORE", payload: ecoScore.score });
    },
    [dispatch, state.userProfile.activityLog]
  );

  const recentActivities = useMemo(
    () => [...state.userProfile.activityLog].reverse().slice(0, 10),
    [state.userProfile.activityLog]
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          Carbon Footprint Calculator
        </h1>
        <p className="text-gray-600">
          Log your daily activities across key categories to calculate and track your environmental footprint.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            id={`category-btn-${cat.value.toLowerCase()}`}
            onClick={() => handleCategoryChange(cat.value)}
            className={`p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-md ${
              selectedCategory === cat.value
                ? "bg-emerald-50/80 border-emerald-400 shadow-lg shadow-emerald-100 scale-[1.02]"
                : "bg-white/40 border-white/20 shadow-md hover:shadow-lg hover:scale-[1.01]"
            }`}
          >
            <span className="text-2xl block mb-2">{cat.icon}</span>
            <span
              className={`text-sm font-semibold ${
                selectedCategory === cat.value ? "text-emerald-700" : "text-gray-700"
              }`}
            >
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Activity Input Form */}
      <section className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Activity Log</h2>

        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <span className="text-lg">✅</span>
            Activity logged successfully! Dashboard updated.
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sub-Activity Select */}
            <div>
              <label htmlFor="activity-subtype" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                id="activity-subtype"
                value={selectedSubType}
                onChange={(e) => setSelectedSubType(e.target.value as ActivitySubType)}
                className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-gray-700 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
              >
                {subTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="activity-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex rounded-lg shadow-sm">
                <input
                  type="number"
                  id="activity-amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddActivity();
                  }}
                  placeholder="e.g. 15"
                  min="0"
                  step="0.1"
                  className="w-full rounded-l-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-colors"
                />
                <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50/80 px-4 text-sm font-medium text-gray-500">
                  {currentOption.unitLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {previewEmission > 0 && (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-center gap-2">
              <span className="text-base">📊</span>
              Estimated emission: <strong>{formatCarbon(previewEmission)}</strong>
              <span className="text-blue-400 ml-1">
                ({EMISSION_FACTORS[selectedSubType].kgCO2PerUnit} kg CO₂/{currentOption.unitLabel})
              </span>
            </div>
          )}

          {/* Emission factor info */}
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>ℹ️</span>
            Factor: {EMISSION_FACTORS[selectedSubType].kgCO2PerUnit} kg CO₂/{currentOption.unitLabel}
            — {EMISSION_FACTORS[selectedSubType].sourceNote}
          </div>

          <div className="border-t border-gray-200/50 pt-4 flex justify-end">
            <PrimaryButton
              id="add-activity-btn"
              onClick={handleAddActivity}
              disabled={!amount || parseFloat(amount) <= 0}
              className={`bg-emerald-600 hover:bg-emerald-700 text-white px-6 transition-all duration-200 ${
                !amount || parseFloat(amount) <= 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"
              }`}
            >
              Add Activity Log
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Activity History */}
      <section className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Activities</h2>
          <span className="text-sm text-gray-500">
            {state.userProfile.activityLog.length} total logged
          </span>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl block mb-4">🌱</span>
            <p className="text-gray-500 font-medium mb-1">No activities logged yet</p>
            <p className="text-gray-400 text-sm">
              Start by selecting a category above and logging your first activity.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const factor = EMISSION_FACTORS[activity.subType];
              const emission = activity.amount * factor.kgCO2PerUnit;
              return (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">
                      {activity.type === ActivityType.Transport && "🚗"}
                      {activity.type === ActivityType.Food && "🍔"}
                      {activity.type === ActivityType.Energy && "⚡"}
                      {activity.type === ActivityType.Waste && "🗑️"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {activity.subType}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activity.amount} {factor.unitLabel} · {formatRelativeDate(activity.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        emission === 0 ? "text-emerald-500" : "text-orange-600"
                      }`}
                    >
                      {emission === 0 ? "Zero ✨" : formatCarbon(emission)}
                    </span>
                    <button
                      onClick={() => handleRemoveActivity(activity.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-sm"
                      aria-label={`Remove ${activity.subType} activity`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
