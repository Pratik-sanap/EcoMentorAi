// src/charts/BarChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface BarChartDataItem {
  name: string;
  actual: number;
  target: number;
}

export interface BarChartProps {
  data: BarChartDataItem[];
  /** Explicit pixel height for the chart area */
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 220 }) => {
  return (
    <div
      style={{ width: "100%", height: `${height}px`, border: "2px dashed #a855f7" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} kg CO₂e`, "Carbon Footprint"]}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Legend verticalAlign="top" height={36} align="right" />
          <Bar
            name="Your Footprint"
            dataKey="actual"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            name="Target Goal"
            dataKey="target"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
