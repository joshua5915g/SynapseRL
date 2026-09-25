"use client";

import React, { useState } from "react";
import { Sparkles, Bot, ShieldAlert, Cpu, ArrowRight, Loader2 } from "lucide-react";

interface TopicGeneratorProps {
  onGenerate: (topic: string, toneGuidance?: string) => void;
  isLoading: boolean;
}

const EXAMPLE_TOPICS = [
  "Zero-Day Threats in Kubernetes",
  "Adversarial Multi-Agent State Drift",
  "Why Most Enterprise DPO Pipelines Fail",
  "LLM Determinism vs Stochastic Reasoning",
];

const TONE_PRESETS = [
  { id: "contrarian", label: "Contrarian & Provocative", desc: "Bold, hook-first, anti-corporate" },
  { id: "blueprint", label: "Architectural Blueprint", desc: "Framework-driven, code/system centric" },
  { id: "executive", label: "Executive Briefing", desc: "ROI, risk mitigation, high leverage" },
];

export function TopicGenerator({ onGenerate, isLoading }: TopicGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("contrarian");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    const toneDesc = TONE_PRESETS.find((t) => t.id === selectedTone)?.desc;
    onGenerate(topic.trim(), toneDesc);
  };

  const handleSelectExample = (example: string) => {
    setTopic(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center">
      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono uppercase tracking-wider mb-6 backdrop-blur-md animate-pulse">
        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        <span>SynapseRL Adversarial State Machine</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
        Human-in-the-Loop{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          RLHF Arena
        </span>
      </h1>

      <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
        Synthesize high-conviction thought leadership through an adversarial loop between a{" "}
        <span className="text-indigo-300 font-medium">Domain SME Agent</span> and an{" "}
        <span className="text-rose-400 font-medium">Algorithm Hacker</span>. Vote on the winning draft to fine-tune future weights.
      </p>

      {/* Generation Form Card */}
      <div className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/40">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Input Field */}
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic (e.g., 'Zero-Day Exploits in Cloud Native DBs')..."
                disabled={isLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-5 py-4 text-base text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Agents Debating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                  <span>Generate Drafts</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Tone Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Tone Guidance:</span>
            {TONE_PRESETS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTone(t.id)}
                disabled={isLoading}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  selectedTone === t.id
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-medium shadow-glow"
                    : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick Example Chips */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-slate-500">Quick Prompts:</span>
            {EXAMPLE_TOPICS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(item)}
                disabled={isLoading}
                className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </form>

        {/* Pulsing Cyber Skeleton Loading State */}
        {isLoading && (
          <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-left animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-indigo-400 animate-bounce" />
                <span className="text-sm font-mono text-indigo-300">
                  Dual Adversarial Graph Pipeline Active...
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400">Mocking Latency (300ms/node)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                  <span>Variant A: Contrarian Loop</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Cycle 1/2</span>
                </div>
                <div className="h-3 bg-indigo-500/20 rounded-md w-3/4"></div>
                <div className="h-3 bg-indigo-500/10 rounded-md w-full"></div>
                <div className="h-3 bg-indigo-500/15 rounded-md w-5/6"></div>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span>Variant B: Framework Loop</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Cycle 1/2</span>
                </div>
                <div className="h-3 bg-cyan-500/20 rounded-md w-4/5"></div>
                <div className="h-3 bg-cyan-500/10 rounded-md w-full"></div>
                <div className="h-3 bg-cyan-500/15 rounded-md w-2/3"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
