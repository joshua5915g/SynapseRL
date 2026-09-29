"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Flame, 
  Zap, 
  TrendingUp, 
  Sparkles, 
  Check, 
  ArrowRight, 
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { scoreHook, generateAlternativeHooks } from "@/lib/api";

interface HookOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantLabel: string;
  currentText: string;
  topic: string;
  onApplyHook: (newHook: string) => void;
}

export function HookOptimizerModal({
  isOpen,
  onClose,
  variantLabel,
  currentText,
  topic,
  onApplyHook,
}: HookOptimizerModalProps) {
  const [scoreData, setScoreData] = useState<any>(null);
  const [altHooks, setAltHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedHook, setAppliedHook] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setAppliedHook(null);

    Promise.all([
      scoreHook(currentText),
      generateAlternativeHooks(topic, currentText),
    ])
      .then(([scoreRes, altRes]) => {
        setScoreData(scoreRes);
        setAltHooks(altRes);
      })
      .finally(() => setLoading(false));
  }, [isOpen, currentText, topic]);

  if (!isOpen) return null;

  const handleSelectHook = (hook: string) => {
    onApplyHook(hook);
    setAppliedHook(hook);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const score = scoreData?.score ?? 75;
  const grade = scoreData?.grade ?? "B";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Viral Hook Optimizer</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-300">
                  {variantLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Opening 2 lines determine 80% of click-through and dwell time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Hook Virality Score Gauge */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Current Opening Line</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-black font-mono px-2.5 py-0.5 rounded border ${
                score >= 85 
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : score >= 70
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-400"
              }`}>
                Grade {grade} • {score}/100
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-white/5 text-xs sm:text-sm text-slate-200 font-mono italic">
            "{scoreData?.first_line || currentText.split("\n")[0]}"
          </div>

          {/* Breakdown bars */}
          {scoreData?.breakdown && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block mb-1">Curiosity ({scoreData.breakdown.curiosity}/25)</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${(scoreData.breakdown.curiosity / 25) * 100}%` }} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Numbers ({scoreData.breakdown.specificity}/25)</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(scoreData.breakdown.specificity / 25) * 100}%` }} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Brevity ({scoreData.breakdown.brevity}/25)</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(scoreData.breakdown.brevity / 25) * 100}%` }} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Urgency ({scoreData.breakdown.urgency}/25)</span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: `${(scoreData.breakdown.urgency / 25) * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generated Alternative Viral Hooks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Recommended High-Virality Hook Replacements</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Click to apply to post</span>
          </div>

          <div className="space-y-2.5">
            {altHooks.map((h, i) => {
              const isApplied = appliedHook === h.hook;
              return (
                <div
                  key={i}
                  onClick={() => handleSelectHook(h.hook)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                    isApplied
                      ? "border-emerald-500 bg-emerald-950/30"
                      : "border-white/[0.08] bg-slate-900/40 hover:border-cyan-500/40 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-white/10 bg-slate-950 text-cyan-300">
                      {h.archetype}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {h.score}/100 Virality
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-snug font-sans group-hover:text-white transition-colors">
                    "{h.hook}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
