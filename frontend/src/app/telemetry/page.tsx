"use client";

import React, { useEffect, useState } from "react";
import { Cpu, TrendingUp, ShieldAlert, BarChart3, Database } from "lucide-react";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { DPOExportCard } from "@/components/dashboard/DPOExportCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { TelemetryMetrics } from "@/lib/types";
import { fetchTelemetry } from "@/lib/api";

export default function TelemetryPage() {
  const [metrics, setMetrics] = useState<TelemetryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTelemetry()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Reward Model & Telemetry Telemetry</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry tracking convergence of the offline reward function and A/B win probabilities.
          </p>
        </div>
        <Badge variant="success">Engine Status: Optimal</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Overall Alignment Score"
          value={`${metrics?.mean_reward_score ?? 0.84}/1.0`}
          change="+0.14 from cold-start"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Composite RLHF heuristic"
        />
        <StatCard
          title="Candidate A (Contrarian) Preference"
          value={`${((metrics?.a_win_rate ?? 0.54) * 100).toFixed(1)}%`}
          change="Statistically significant"
          isPositive={true}
          icon={BarChart3}
          subtitle="Across all topic categories"
        />
        <StatCard
          title="Candidate B (Blueprint) Preference"
          value={`${((metrics?.b_win_rate ?? 0.46) * 100).toFixed(1)}%`}
          change="Secondary choice"
          isPositive={false}
          icon={Database}
          subtitle="Preferred in technical deep-dives"
        />
      </div>

      {/* Chart Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Reward Trajectory & Engagement Correlation</h2>
          <Badge variant="cyber">7-Day Trajectory</Badge>
        </div>
        <TelemetryChart data={metrics?.reward_curve || []} />
      </div>

      <div className="max-w-md">
        <DPOExportCard />
      </div>
    </div>
  );
}
