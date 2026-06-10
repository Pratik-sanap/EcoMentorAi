// src/charts/DonutChart.tsx
"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export interface DonutChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartDataItem[];
  /** Explicit pixel height for the chart area */
  height?: number;
}

const DEFAULT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export const DonutChart: React.FC<DonutChartProps> = ({ data, height = 220 }) => {
  return (
    <div
      style={{ width: "100%", height: `${height}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="75%"
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((item, index) => (
              <Cell
                key={`donut-cell-${index}`}
                fill={item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} kg CO₂e`, "Emissions"]}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          />
          <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
