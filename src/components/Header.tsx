"use client"
import Link from "next/link";
import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white/30 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="text-xl font-bold text-green-700">
          EcoMentor AI
        </div>
        <ul className="flex space-x-4 text-sm font-medium">
          <li>
            <Link href="/" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/calculator" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Calculator
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500" aria-label="Dashboard navigation link">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/recommendations" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Recommendations
            </Link>
          </li>
          <li>
            <Link href="/challenges" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Challenges
            </Link>
          </li>
          <li>
            <Link href="/what-if" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              What‑If
            </Link>
          </li>
          <li>
            <Link href="/coach" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Coach
            </Link>
          </li>
          <li>
            <Link href="/profile" className="text-gray-800 hover:text-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
