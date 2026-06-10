// src/app/coach/page.tsx
"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useAppState } from "../../lib/state";
import { InfoCard } from "../../components/InfoCard";
import { generateCoachInsights } from "../../ai/coachEngine";
import { generateRecommendations } from "../../engine/recommendation/recommendationEngine";
import { generateCarbonReport } from "../../engine/carbon/carbonEngine";
import { calculateEcoScore } from "../../engine/scoring/scoringEngine";

interface Message {
  sender: "coach" | "user";
  text: string;
  time: string;
}

export default function CoachPage() {
  const state = useAppState();
  const { activityLog, carbonReport: storedReport, currentScore: storedScore } = state.userProfile;
  const hasActivities = activityLog.length > 0;

  // Derive report
  const report = useMemo(() => {
    if (storedReport && hasActivities) return storedReport;
    if (hasActivities) return generateCarbonReport(activityLog);
    return null;
  }, [storedReport, activityLog, hasActivities]);

  // Derive eco score
  const ecoScore = useMemo(() => {
    if (storedScore !== undefined && hasActivities) return storedScore;
    if (report && hasActivities) return calculateEcoScore(report, activityLog).score;
    return 68; // Mock default
  }, [storedScore, report, activityLog, hasActivities]);

  // Derive coach insights dynamically
  const coachInsights = useMemo(() => {
    const recs = report
      ? generateRecommendations(
          report,
          { score: ecoScore, scoreLevel: "Improving" as any, improvementPotential: 50 },
          activityLog
        ).recommendations
      : [];
    return generateCoachInsights(ecoScore, report?.topEmissionCategory, recs, activityLog);
  }, [ecoScore, report, activityLog]);

  // Chat interface state
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "coach",
      text: `Hello! I'm EcoMentor, your rule-based AI Sustainability Coach. Based on your current Eco Score of ${ecoScore}, I've compiled a detailed insight report above. You can also ask me questions below about how to reduce emissions in categories like Transport, Food, Energy, Waste, or Shopping!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate rule-based response
    setTimeout(() => {
      const query = inputText.toLowerCase();
      let responseText = "";

      if (query.includes("transport") || query.includes("car") || query.includes("drive") || query.includes("bus") || query.includes("train")) {
        responseText = "For transportation, switching to public transit or carpooling is ideal. If your destination is under 5 km, walking or biking is a zero-emission alternative that boosts your health! Commuting by bus/train reduces your travel emissions by up to 70% compared to driving a car.";
      } else if (query.includes("food") || query.includes("diet") || query.includes("meat") || query.includes("vegetarian") || query.includes("vegan")) {
        responseText = "Diet is a major factor in carbon footprints. Beef and lamb have the highest impact. Swapping meat for lentils, beans, or vegetables just 2-3 days a week can drop food emissions by 30%. Minimizing food waste also stops landfill methane!";
      } else if (query.includes("energy") || query.includes("electricity") || query.includes("power") || query.includes("light") || query.includes("heat")) {
        responseText = "To cut household energy use, start with vampire loads by unplugging chargers when idle. Washing laundry at 30°C and drying clothes naturally instead of using a dryer saves a large amount of power. Using LED bulbs and turning down thermostats by 1°C also lowers energy footprints.";
      } else if (query.includes("waste") || query.includes("recycle") || query.includes("compost")) {
        responseText = "Proper sorting is crucial. Composting food waste prevents it from degrading into methane in landfills, while recycling clean cardboard, plastic, and glass extends material lifecycles. Aim to reduce single-use packages when buying groceries.";
      } else if (query.includes("shop") || query.includes("buy") || query.includes("purchase") || query.includes("clothes")) {
        responseText = "Shopping emissions are driven by the manufacturing and shipping of goods. Try to buy high-quality, durable items, choose standard shipping instead of express, and consider purchasing secondhand items to save up to 90% of a product's initial carbon footprint.";
      } else if (query.includes("score") || query.includes("eco") || query.includes("improvement")) {
        responseText = `Your current Eco Score is ${ecoScore}. You can raise it by logging activities consistently, completing weekly challenges, and targetting your highest emission category: ${report?.topEmissionCategory || "None yet"}.`;
      } else {
        responseText = "I'm here to help! Ask me about specific categories like Transport, Food, Energy, Waste, or Shopping for tailored reduction tips, or review the Weekly Challenges page to start taking action today.";
      }

      const coachMsg: Message = {
        sender: "coach",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          AI Sustainability Coach
        </h1>
        <p className="text-gray-650">
          Get real-time, rule-based coaching insights and customized recommendations to decrease your carbon footprint.
        </p>
      </div>

      {/* Dynamic Coach Insights Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📅</span>
              <h2 className="text-lg font-bold text-gray-800">Weekly Summary</h2>
            </div>
            <p className="text-sm text-gray-650 leading-relaxed mb-4">
              {coachInsights.weeklySummary}
            </p>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-100/30 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Positive Reinforcement
            </span>
            <p className="text-xs text-emerald-700 leading-relaxed">
              {coachInsights.positiveReinforcement}
            </p>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl transition">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📈</span>
              <h2 className="text-lg font-bold text-gray-800">Biggest Improvement Area</h2>
            </div>
            <p className="text-sm text-gray-650 leading-relaxed mb-4">
              {coachInsights.biggestImprovementArea}
            </p>
          </div>
          <div className="bg-blue-50/60 border border-blue-100/30 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
              Personal Advice
            </span>
            <p className="text-xs text-blue-700 leading-relaxed">
              {coachInsights.personalizedAdvice}
            </p>
          </div>
        </div>
      </section>

      {/* Combined Coach Advice Example Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-emerald-850 mb-2">🎯 AI Coach Insight Summary</h3>
        <p className="text-sm text-gray-700 italic leading-relaxed">
          "{coachInsights.fullAdviceText}"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat History Panel */}
        <section className="lg:col-span-3 bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col h-[450px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-white/90 text-gray-800 shadow-sm border border-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Area */}
          <form onSubmit={handleSend} className="border-t border-gray-200/50 pt-4 mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask EcoMentor anything about sustainability..."
                className="flex-1 rounded-xl border border-gray-300 bg-white/70 px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none transition"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition"
              >
                Send
              </button>
            </div>
          </form>
        </section>

        {/* Coach Info Sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          <InfoCard
            title="Smarter Tips"
            description="Our coach learns from your activity logs to suggest personalized actions that fit your routine."
          />
          <InfoCard
            title="Privacy Guard"
            description="All coach conversations run client-side. We never store personal chat history on remote databases."
          />
        </aside>
      </div>
    </div>
  );
}
