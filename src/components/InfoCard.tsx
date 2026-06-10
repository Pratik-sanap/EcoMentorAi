// src/components/InfoCard.tsx
import React, { ReactNode } from "react";

export interface InfoCardProps {
  /** Optional icon node (e.g. emoji or SVG) */
  icon?: ReactNode;
  /** Title of the card */
  title: string;
  /** Main descriptive text */
  description: string;
  /** Optional action element (button, link, etc.) */
  action?: ReactNode;
  /** Custom classes */
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`bg-white/40 backdrop-blur-md border border-white/20 shadow-md rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg ${className}`}
      role="article"
    >
      <div>
        {icon && (
          <div className="text-3xl mb-4" aria-hidden="true">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{description}</p>
      </div>
      {action && <div className="mt-auto pt-2">{action}</div>}
    </div>
  );
};
