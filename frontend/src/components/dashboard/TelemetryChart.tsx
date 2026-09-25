"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import { TimeSeriesPoint } from "@/lib/types";

interface TelemetryChartProps {
  data: TimeSeriesPoint[];
}

export function TelemetryChart({ data }: TelemetryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-sm">
        No telemetry data available.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="impressionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

          <XAxis
            dataKey="timestamp"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1e293b" }}
          />

          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            domain={[0, 1]}
            tickFormatter={(val) => `${val.toFixed(1)}`}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const p = payload[0].payload as TimeSeriesPoint;
                return (
                  <div className="glass-panel p-3 rounded-xl text-xs space-y-1 border border-slate-700 font-mono">
                    <p className="font-sans font-semibold text-slate-200">{p.timestamp}</p>
                    <p className="text-indigo-400">Reward Score: {p.reward_score}</p>
                    <p className="text-cyan-400">Impressions: {p.impressions}</p>
                    <p className="text-emerald-400">Engagement: {(p.engagement_rate * 100).toFixed(2)}%</p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area
            type="monotone"
            dataKey="reward_score"
            stroke="#6366f1"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#rewardGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
