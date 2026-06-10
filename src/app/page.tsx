// src/app/page.tsx
import React from "react";
import Link from "next/link";

export default function HomePage() {
  const quickLinks = [
    {
      title: "Carbon Calculator",
      description: "Measure your daily impact. Log activities for transport, food, energy, and waste.",
      href: "/calculator",
      icon: "📊",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "AI Coach",
      description: "Get smart, personalized sustainability coaching and tips tailored to your lifestyle.",
      href: "/coach",
      icon: "🤖",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Recommendations",
      description: "Explore actionable steps to reduce your carbon footprint and raise your eco score.",
      href: "/recommendations",
      icon: "💡",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Dashboard Analytics",
      description: "Visualize your progress with custom charts and track your carbon score (0-100) history.",
      href: "/dashboard",
      icon: "📈",
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Weekly Challenges",
      description: "Join eco-challenges, complete weekly goals, and build your green streak.",
      href: "/challenges",
      icon: "🏆",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "What-If Simulator",
      description: "Simulate lifestyle changes. See the impact of going vegan or taking public transit.",
      href: "/what-if",
      icon: "🔮",
      color: "from-purple-500 to-indigo-600",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh] py-12 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            EcoMentor AI
          </span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-700 mb-6">
          Carbon Footprint Awareness Platform
        </p>
        <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
          Empowering individuals and communities to understand, track, and reduce their environmental impact with personalized insights and gamified challenges.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/calculator"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Calculate Footprint
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Manage Profile
          </Link>
        </div>
      </section>

      {/* Navigation Quick Links Grid */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Explore Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group relative bg-white/40 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 flex flex-col items-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl" role="img" aria-label={link.title}>
                  {link.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
                {link.description}
              </p>
              <div className="text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                Get Started <span className="ml-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
