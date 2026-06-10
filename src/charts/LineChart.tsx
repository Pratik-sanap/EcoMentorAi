// src/charts/LineChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export interface LineChartDataItem {
  date: string;
  emissions: number;
}

export interface LineChartProps {
  data: LineChartDataItem[];
  /** Explicit pixel height for the chart area */
  height?: number;
  /** Primary color for the line path */
  lineColor?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 220,
  lineColor = "#10b981",
}) => {
  return (
    <div
      style={{ width: "100%", height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
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
          <Legend verticalAlign="top" height={36} align="right" iconType="plainline" />
          <Line
            name="Emissions Progress"
            type="monotone"
            dataKey="emissions"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};
