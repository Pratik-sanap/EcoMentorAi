// src/components/ProgressBar.tsx
import React from "react";

export interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Target or maximum value */
  max?: number;
  /** Label for accessibility */
  label?: string;
  /** Custom colors or class overrides */
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = "Progress",
  colorClass = "bg-emerald-500",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full flex flex-col gap-1.5" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="flex justify-between text-xs font-semibold text-gray-600">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-200/60 backdrop-blur-sm rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
