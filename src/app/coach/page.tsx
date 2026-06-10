// src/app/coach/page.tsx
"use client";

import React from "react";
import { InfoCard } from "../../components/InfoCard";

export default function CoachPage() {
  const dummyMessages = [
    {
      sender: "coach",
      text: "Hello! I am your EcoMentor AI Coach. I can help answer questions about sustainability or give suggestions on reducing your footprint.",
      time: "10:00 AM",
    },
    {
      sender: "user",
      text: "What are some easy ways to reduce my household energy use?",
      time: "10:02 AM",
    },
    {
      sender: "coach",
      text: "Great question! Some quick wins include unplugging electronics when not in use, washing clothes in cold water, and setting your thermostat 1-2 degrees lower in winter.",
      time: "10:03 AM",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
          AI Sustainability Coach
        </h1>
        <p className="text-gray-600">
          Get real-time, personalized guidance from our Gemini-powered AI sustainability coach.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat History Panel */}
        <section className="lg:col-span-3 bg-white/40 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-6 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {dummyMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[75%] ${
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white/85 text-gray-800 shadow-sm border border-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Chat Input Area Placeholder */}
          <div className="border-t border-gray-200/50 pt-4 mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask EcoMentor anything... (disabled during setup)"
                className="flex-1 rounded-xl border border-gray-300 bg-white/70 px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none"
                disabled
              />
              <button
                type="button"
                className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-600 text-white opacity-70 cursor-not-allowed"
                disabled
              >
                Send
              </button>
            </div>
          </div>
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
