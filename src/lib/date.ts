// src/lib/date.ts
/**
 * Date utility functions for activity logging and challenge tracking.
 */

/**
 * Formats a date string (ISO) or Date object to a human-readable format.
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a date string (ISO) or Date object to a short relative format (e.g. "Today", "Yesterday").
 */
export const formatRelativeDate = (date: string | Date): string => {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  
  // Strip time for day comparison
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  
  const diffDays = Math.round((today - targetDay) / oneDay);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return target.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

/**
 * Checks if a date falls in the current week.
 */
export const isThisWeek = (date: string | Date): boolean => {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  
  // Calculate start of current week (Sunday)
  const sunday = new Date(now.setDate(now.getDate() - now.getDay()));
  sunday.setHours(0, 0, 0, 0);
  
  // Calculate end of current week (Saturday)
  const saturday = new Date(sunday);
  saturday.setDate(saturday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);
  
  const targetTime = target.getTime();
  return targetTime >= sunday.getTime() && targetTime <= saturday.getTime();
};
