"use client";

import React, { useState, useEffect } from "react";
import { Award, Copy, Check, Sparkles, Clock, RefreshCw, Layers, ArrowLeft } from "lucide-react";
import { GenerateABResponse } from "@/lib/types";

interface ArenaProps {
  generationData: GenerateABResponse;
  onSelectWinner: (winner: "candidate_a" | "candidate_b", dwellTimeMs: number) => void;
  onReset: () => void;
}

export function Arena({ generationData, onSelectWinner, onReset }: ArenaProps) {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [generationData]);

  const handleCopy = (text: string, variant: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVariant(variant);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

  const handleChoose = (winner: "candidate_a" | "candidate_b") => {
    const dwellTimeMs = Date.now() - startTime;
    onSelectWinner(winner, dwellTimeMs);
  };

  const wordCountA = generationData.variant_a.split(/\s+/).filter(Boolean).length;
  const wordCountB = generationData.variant_b.split(/\s+/).filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Arena Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-950/60 text-xs font-mono text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Topic</span>
          </button>
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
              Active Evaluation Topic
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              "{generationData.topic}"
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Passes: A({generationData.iterations_a}) vs B({generationData.iterations_b})</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-white/5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>RLHF Live Arena</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Arena Battle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VARIANT A CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-glow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm border border-indigo-500/30">
                  A
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Variant A</h3>
                  <span className="text-xs font-mono text-cyan-400">Contrarian & Provocative Hook</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{wordCountA} words</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generationData.variant_a, "A")}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-950/40 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedVariant === "A" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="rounded-xl border border-white/5 bg-slate-950/70 p-5 sm:p-6 text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-6 select-text min-h-[280px]">
              {generationData.variant_a}
            </div>
          </div>

          {/* Winner CTA */}
          <button
            type="button"
            onClick={() => handleChoose("candidate_a")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Select Variant A as Winner</span>
          </button>
        </div>

        {/* VARIANT B CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-glow-cyan relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/30">
                  B
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Variant B</h3>
                  <span className="text-xs font-mono text-emerald-400">Architectural Framework Blueprint</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500">{wordCountB} words</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generationData.variant_b, "B")}
                  className="p-1.5 rounded-lg border border-white/5 bg-slate-950/40 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copiedVariant === "B" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="rounded-xl border border-white/5 bg-slate-950/70 p-5 sm:p-6 text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-6 select-text min-h-[280px]">
              {generationData.variant_b}
            </div>
          </div>

          {/* Winner CTA */}
          <button
            type="button"
            onClick={() => handleChoose("candidate_b")}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 py-3.5 font-semibold text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Select Variant B as Winner</span>
          </button>
        </div>
      </div>
    </div>
  );
}
