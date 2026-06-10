// src/components/Footer.tsx
import React from "react";
import { THEME } from "../lib/constants";

/**
 * Footer component – simple, accessible, and responsive.
 * Uses glassmorphism background to match the overall theme.
 */
export const Footer: React.FC = () => {
  return (
    <footer
      className="bg-white/30 backdrop-blur-md text-center py-4 mt-8"
      role="contentinfo"
    >
      <p className="text-sm text-gray-700">
        © {new Date().getFullYear()} EcoMentor AI – All rights reserved.
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Powered by sustainable design principles.
      </p>
    </footer>
  );
};
