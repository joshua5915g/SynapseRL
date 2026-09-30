"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Flame,
  TrendingUp,
  Smartphone,
  Monitor,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { predictVelocity } from "@/lib/api";

const HIGH_VELOCITY_SAMPLE = `Most teams building high-throughput data pipelines are making a $200k memory mistake:

They treat vector indices like relational tables instead of memory-hungry in-memory graphs.

If you don't enforce metadata filtering over flat IVF indices, your p99 query latency will degrade by 4.2x under high concurrency.

Here is the 3-step mitigation playbook:
1. Isolate the consensus heartbeat thread from disk writes.
2. Partition indices across tenant tiers with memory-mapped storage.
3. Enforce adversarial query timeouts before socket commits.

What is your team's biggest state bottleneck in production today?`;

const LOW_VELOCITY_SAMPLE = `In today's rapidly evolving world of technology, we are pleased to announce our latest strategic initiatives regarding enterprise architectures. It is truly critical and important to note that many different aspects of modern computing require our utmost attention and dedication. We believe that by fostering synergy across all departments and unlocking paradigms of transformative excellence, we can achieve substantial growth and move the needle on our core KPIs. Furthermore, our teams have been working tirelessly to deliver results that will undoubtedly stand the test of time and revolutionize operations.`;

export default function VelocityPage() {
  const [content, setContent] = useState(HIGH_VELOCITY_SAMPLE);
  const [velocityData, setVelocityData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeDeviceView, setActiveDeviceView] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    handleRunAnalysis(HIGH_VELOCITY_SAMPLE);
  }, []);

  const handleRunAnalysis = async (textToAnalyze?: string) => {
    const text = textToAnalyze !== undefined ? textToAnalyze : content;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const data = await predictVelocity(text);
      setVelocityData(data);
    } catch (err) {
      console.error("Velocity prediction error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const vIndex = velocityData?.velocity_index ?? 85;
  const scrollStop = velocityData?.scroll_stop_score ?? 88;
  const dwellRetention = velocityData?.dwell_retention_score ?? 84;
  const commentPropensity = velocityData?.comment_propensity ?? 80;
  const tier = velocityData?.algorithm_tier ?? "Tier S (Exponential Velocity)";
  const retentionCurve = velocityData?.retention_curve ?? [];
  const directives = velocityData?.actionable_directives ?? [];

  const mobileCutoff = velocityData?.mobile_fold_char ?? 150;
  const desktopCutoff = velocityData?.desktop_fold_char ?? 220;
  const activeCutoff = activeDeviceView === "mobile" ? mobileCutoff : desktopCutoff;

  const aboveFoldText = content.slice(0, activeCutoff);
  const belowFoldText = content.slice(activeCutoff);

  const tierColor =
    vIndex >= 85
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : vIndex >= 70
      ? "text-sky-400 border-sky-500/40 bg-sky-500/10"
      : vIndex >= 55
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  First-60-Minutes Algorithm Velocity Predictor
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Feature #9
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Algorithm distribution forensics: Simulates scroll-stop probability, mobile/desktop "...see more" fold drop-offs, and paragraph dwell retention curves.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setContent(HIGH_VELOCITY_SAMPLE);
              handleRunAnalysis(HIGH_VELOCITY_SAMPLE);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 text-xs font-mono transition-all cursor-pointer"
          >
            Tier S Sample (High Reach)
          </button>
          <button
            type="button"
            onClick={() => {
              setContent(LOW_VELOCITY_SAMPLE);
              handleRunAnalysis(LOW_VELOCITY_SAMPLE);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-mono transition-all cursor-pointer"
          >
            Dense Wall Sample (Drop-off Risk)
          </button>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Composite Velocity Index */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Velocity Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${tierColor.split(" ")[0]}`}>
                {vIndex}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Scroll-Stop */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Scroll-Stop Rate
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{scrollStop}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${scrollStop}%` }} />
          </div>
        </div>

        {/* Metric 3: Dwell Retention */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Dwell Retention
            </span>
            <span className="text-xs font-mono text-indigo-400 font-bold">{dwellRetention}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${dwellRetention}%` }} />
          </div>
        </div>

        {/* Metric 4: Comment Propensity */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Debate Flywheel
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">{commentPropensity}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${commentPropensity}%` }} />
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Draft Editor & Fold Cutoff Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Post Text Editor
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveDeviceView("mobile")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeDeviceView === "mobile"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile Fold ({mobileCutoff}c)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeviceView("desktop")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                    activeDeviceView === "desktop"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Monitor className="w-3 h-3" />
                  <span>Desktop ({desktopCutoff}c)</span>
                </button>
              </div>
            </div>

            <textarea
              rows={9}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                handleRunAnalysis(e.target.value);
              }}
              placeholder="Paste or write your post to analyze algorithmic velocity..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 font-sans leading-relaxed resize-y"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-slate-500">
                {content.length} chars • {content.split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                type="button"
                onClick={() => handleRunAnalysis()}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-cyan disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>Calculate Velocity</span>
              </button>
            </div>
          </div>

          {/* Actionable Directives */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Algorithmic Retention Directives</span>
            </span>

            <div className="space-y-2">
              {directives.map((dir: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-white/5 bg-slate-950 text-xs text-slate-300 flex items-start gap-2.5 font-sans"
                >
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{dir}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fold Cutoff Visualizer & Retention Decay Curve (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Fold Cutoff Box */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeDeviceView === "mobile" ? "Mobile Feed (iOS/Android)" : "Desktop Feed"} Fold Split</span>
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${tierColor}`}>
                {tier}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 font-sans text-xs sm:text-sm leading-relaxed">
              {/* Above Fold */}
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-100">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1 font-bold">
                  ✓ VISIBLE ABOVE THE FOLD (Instant Scroll-Stop)
                </span>
                <p className="whitespace-pre-line">{aboveFoldText}</p>
              </div>

              {/* Below Fold */}
              {belowFoldText && (
                <div className="p-2.5 rounded-lg bg-slate-900/40 border border-white/5 text-slate-400 opacity-80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-1 font-bold">
                    🔒 HIDDEN BEHIND "...SEE MORE" FOLD
                  </span>
                  <p className="whitespace-pre-line line-clamp-3">{belowFoldText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Retention Decay Curve */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulated Reader Retention by Paragraph</span>
            </span>

            <div className="space-y-2.5 pt-1">
              {retentionCurve.map((rc: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 truncate max-w-[280px]">
                      P{rc.paragraph_index}: {rc.preview}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {rc.estimated_retention_pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 rounded-full"
                      style={{ width: `${rc.estimated_retention_pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
