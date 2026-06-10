// src/components/PrimaryButton.tsx
import React from "react";
import { THEME } from "../lib/constants";

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label */
  children: React.ReactNode;
  /** Optional variant – currently only "primary" is supported */
  variant?: "primary";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...rest
}) => {
  const baseClasses =
    "px-4 py-2 rounded-md font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
  const colorClasses =
    variant === "primary"
      ? `bg-${THEME.primary} text-white hover:bg-${THEME.primary}\/80`
      : "bg-gray-200 text-gray-800";
  return (
    <button className={`${baseClasses} ${colorClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};
