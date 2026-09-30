"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Target,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  BarChart2,
  RefreshCw,
  Layers,
  Smartphone,
  Sliders
} from "lucide-react";
import { scoreHook, generateAlternativeHooks } from "@/lib/api";

const PRESET_TOPICS = [
  "Multi-Agent LLM State Drift",
  "Microservices Sprawl in B2B Startups",
  "Kubernetes Cloud Cost Blowouts",
  "Why Most Enterprise DPO Pipelines Fail",
  "Event-Driven Architecture Anti-Patterns"
];

const DEFAULT_HOOK = "Most teams scaling Kubernetes make a $200k security mistake before line 1.";

export default function HookLabPage() {
  const [topic, setTopic] = useState("Multi-Agent LLM State Drift");
  const [customHook, setCustomHook] = useState(DEFAULT_HOOK);
  const [scoreData, setScoreData] = useState<any>(null);
  const [generatedHooks, setGeneratedHooks] = useState<any[]>([]);
  const [isScoring, setIsScoring] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCustom, setCopiedCustom] = useState(false);

  useEffect(() => {
    handleRunScore(DEFAULT_HOOK);
    handleGenerateArchetypes("Multi-Agent LLM State Drift");
  }, []);

  const handleRunScore = async (textToScore?: string) => {
    const text = textToScore !== undefined ? textToScore : customHook;
    if (!text.trim()) return;

    setIsScoring(true);
    try {
      const data = await scoreHook(text);
      setScoreData(data);
    } catch (err) {
      console.error("Hook score error:", err);
    } finally {
      setIsScoring(false);
    }
  };

  const handleGenerateArchetypes = async (overrideTopic?: string) => {
    const activeTopic = overrideTopic || topic;
    setIsGenerating(true);
    try {
      const hooks = await generateAlternativeHooks(activeTopic, customHook);
      setGeneratedHooks(hooks || []);
    } catch (err) {
      console.error("Hook generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHook = (hookText: string) => {
    setCustomHook(hookText);
    handleRunScore(hookText);
  };

  const handleCopy = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCopiedCustom(true);
      setTimeout(() => setCopiedCustom(false), 2000);
    }
  };

  const score = scoreData?.score ?? 75;
  const grade = scoreData?.grade ?? "A";
  const breakdown = scoreData?.breakdown ?? { curiosity: 18, specificity: 20, brevity: 22, urgency: 15 };
  const suggestions = scoreData?.suggestions ?? [];
  const charCount = customHook.length;
  const isOverCutoff = charCount > 130;

  const gradeColor =
    grade === "S"
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : grade === "A"
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : grade === "B"
      ? "text-sky-400 border-sky-500/40 bg-sky-500/10"
      : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Viral Hook Intelligence Lab
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Feature #3
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Opening headline science: Scores virality (0–100), simulates the mobile "...see more" cutoff fold, and generates 5 high-performing psychological archetypes.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Topic Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_TOPICS.slice(0, 3).map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTopic(t);
                handleGenerateArchetypes(t);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-all cursor-pointer"
            >
              {t.split(" ")[0]}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Hook Scorer & 4-Pillar Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Custom Hook Input & Live Gauge */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Hook Virality Gauge</span>
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isOverCutoff ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}`}>
                  {charCount} / 130 chars {isOverCutoff && "(Fold Overflow)"}
                </span>
              </div>
            </div>

            <textarea
              rows={3}
              value={customHook}
              onChange={(e) => {
                setCustomHook(e.target.value);
                handleRunScore(e.target.value);
              }}
              placeholder="Type your opening sentence or hook here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-colors font-sans leading-relaxed resize-none"
            />

            {/* Scorecard Hero Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-mono ${gradeColor}`}>
                  <span className="text-xs uppercase font-medium">Tier</span>
                  <span className="text-2xl font-black">{grade}</span>
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{score}</span>
                    <span className="text-xs text-slate-500 font-mono">/ 100 Virality Score</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {score >= 85 ? "Optimal scroll-stop velocity detected." : "Underperforming curiosity/specificity baseline."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(customHook)}
                className="p-2.5 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                title="Copy hook text"
              >
                {copiedCustom ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* 4-Pillar Score Breakdown */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider block">
                Algorithmic Pillar Breakdown
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Curiosity */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Curiosity Gap</span>
                    <span className="font-mono text-cyan-400 font-bold">{breakdown.curiosity} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(breakdown.curiosity / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Specificity */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Numeric Anchors</span>
                    <span className="font-mono text-indigo-400 font-bold">{breakdown.specificity} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${(breakdown.specificity / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Brevity */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Fold Brevity</span>
                    <span className="font-mono text-emerald-400 font-bold">{breakdown.brevity} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(breakdown.brevity / 25) * 100}%` }} />
                  </div>
                </div>

                {/* Urgency */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Stakes & Pain</span>
                    <span className="font-mono text-amber-400 font-bold">{breakdown.urgency} / 25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(breakdown.urgency / 25) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Directives */}
            {suggestions.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                <span className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Algorithmic Optimization Recommendations</span>
                </span>
                <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                  {suggestions.map((sug: string, idx: number) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Mobile Feed Preview Mockup */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mobile Feed Fold Simulation</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">iOS / Android Feed</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3 font-sans">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Engineering Founder</span>
                    <span className="text-[10px] text-slate-400">• 1st</span>
                  </div>
                  <span className="text-[10px] text-slate-500">VP of Systems • 2h • 🌐</span>
                </div>
              </div>

              {/* Feed Text with '...see more' fold marker */}
              <div className="text-xs text-slate-200 leading-relaxed">
                <span>{customHook.slice(0, 130)}</span>
                {customHook.length > 130 ? (
                  <span className="text-slate-400 font-semibold cursor-pointer">
                    ...see more
                  </span>
                ) : (
                  <span className="text-slate-500 ml-1">...see more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Archetype Generator (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>5 Viral Hook Archetypes Generator</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic for alternative hooks..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50 font-sans"
              />
              <button
                type="button"
                onClick={() => handleGenerateArchetypes()}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-cyan disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate</span>
              </button>
            </div>

            {/* Generated Archetype Cards */}
            <div className="space-y-3 pt-2">
              {generatedHooks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-cyan-500/30 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.archetype}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {item.score}/100
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        Tier {item.grade}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                    "{item.hook}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => handleSelectHook(item.hook)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-cyan-500/10 transition-colors cursor-pointer"
                    >
                      Test in Gauge
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.hook, idx)}
                      className="text-[11px] font-mono text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                    </button>
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
