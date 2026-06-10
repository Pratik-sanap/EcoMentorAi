// src/components/ScoreCard.tsx
import React from "react";
import { THEME } from "../lib/constants";
import { PrimaryButton } from "./PrimaryButton";

interface ScoreCardProps {
  /** Current carbon score (0‑100) */
  score?: number;
  /** Optional caption displayed under the score */
  caption?: string;
  /** Optional click handler for more details */
  onViewDetails?: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score = 0,
  caption = "Current Carbon Score",
  onViewDetails,
}) => {
  const normalized = Math.min(Math.max(score, 0), 100);
  const rotation = (normalized / 100) * 360;

  return (
    <div
      className="w-full max-w-sm p-4 bg-white/30 backdrop-blur-md rounded-xl shadow-sm flex flex-col items-center"
      role="region"
      aria-label="Score card"
    >
      <div className="relative w-24 h-24 mb-3">
        {/* Circular progress indicator using conic gradient */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${THEME.primary} ${rotation}deg, #e5e7eb 0deg)`,
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
          <span className="text-2xl font-bold text-gray-800">{normalized}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{caption}</p>
      {onViewDetails && (
        <PrimaryButton onClick={onViewDetails}>Details</PrimaryButton>
      )}
    </div>
  );
};
