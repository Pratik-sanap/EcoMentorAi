"use client"
import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { THEME } from "../lib/constants";
import { AppProvider } from "../lib/state";

/**
 * Layout component that wraps pages with Header, Footer and a responsive content area.
 * Uses glassmorphism background to match the overall aesthetic.
 * Includes AppProvider for global state management.
 */
export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

