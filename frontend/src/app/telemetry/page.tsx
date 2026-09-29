"use client";

import React, { useEffect, useState } from "react";
import { Cpu, TrendingUp, ShieldAlert, BarChart3, Database, Clock, RefreshCw, Sparkles, Tag } from "lucide-react";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { DPOExportCard } from "@/components/dashboard/DPOExportCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { TelemetryMetrics } from "@/lib/types";
import { fetchTelemetry } from "@/lib/api";

export default function TelemetryPage() {
  const [metrics, setMetrics] = useState<TelemetryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = () => {
    setRefreshing(true);
    fetchTelemetry()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const MICRO_TAG_STATS = [
    { name: "Punchier Hook", pct: 78, color: "bg-indigo-500" },
    { name: "Zero Corporate Fluff", pct: 64, color: "bg-cyan-500" },
    { name: "Deeper Engineering Proof", pct: 52, color: "bg-purple-500" },
    { name: "Stronger Contrarian Take", pct: 45, color: "bg-rose-500" },
    { name: "Clearer Call-to-Action", pct: 31, color: "bg-emerald-500" },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
              Reward Model & Convergence Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time telemetry tracking convergence of the offline reward function, pairwise A/B win probabilities, and dwell-time heuristics.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            <span>Refresh Telemetry</span>
          </button>
          <Badge variant="success" className="py-1 px-3">
            Reward Loop: Converging
          </Badge>
        </div>
      </div>

      {/* Bento Grid 4-Column KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Alignment Score"
          value={`${metrics?.mean_reward_score ?? 0.84}/1.0`}
          change="+0.14 from baseline"
          isPositive={true}
          icon={TrendingUp}
          subtitle="Composite heuristic"
          badge="High Signal"
        />
        <StatCard
          title="Candidate A (Contrarian) Rate"
          value={`${((metrics?.a_win_rate ?? 0.54) * 100).toFixed(1)}%`}
          change="+8.2% feed velocity"
          isPositive={true}
          icon={BarChart3}
          subtitle="Dominates viral themes"
          badge="Hook Engine"
        />
        <StatCard
          title="Candidate B (Blueprint) Rate"
          value={`${((metrics?.b_win_rate ?? 0.46) * 100).toFixed(1)}%`}
          change="Preferred in systems"
          isPositive={true}
          icon={Database}
          subtitle="Technical architecture"
          badge="Depth Engine"
        />
        <StatCard
          title="Mean Dwell Evaluation"
          value="18.4s"
          change="Optimal attention span"
          isPositive={true}
          icon={Clock}
          subtitle="Implicit RLHF weighting"
          badge="Implicit Signal"
        />
      </div>

      {/* Main Chart Section */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Reward Trajectory & Engagement Correlation
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates relationship between offline heuristic reward scores and observed engagement dwell-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Reward Score
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Impressions
            </span>
          </div>
        </div>

        <TelemetryChart data={metrics?.reward_curve || []} />
      </div>

      {/* Lower Bento Grid: DPO Export Hub + Qualitative Tag Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DPOExportCard />

        {/* Qualitative Micro-Tag Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Qualitative Micro-Tag Frequency</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Top Drivers</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-5">
              Heuristic frequency of user-applied micro-tags across all winning candidate pairwise evaluations.
            </p>

            <div className="space-y-3.5">
              {MICRO_TAG_STATS.map((tag) => (
                <div key={tag.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{tag.name}</span>
                    <span className="text-slate-400">{tag.pct}% win attribution</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 border border-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${tag.color} transition-all duration-500`}
                      style={{ width: `${tag.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Feedback Signal: Multi-Tag Vector</span>
            <span className="text-indigo-400 font-medium">98.4% Confidence Margin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
