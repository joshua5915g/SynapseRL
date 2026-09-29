"use client";

import React, { useState } from "react";
import { 
  X, 
  Workflow, 
  Bot, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Flame, 
  FileDiff, 
  Sparkles,
  GitCommit
} from "lucide-react";

interface DebateInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantLabel: string;
  topic: string;
  drafts: string[];
  critiques: string[];
  finalDraft: string;
}

export function DebateInspectorModal({
  isOpen,
  onClose,
  variantLabel,
  topic,
  drafts,
  critiques,
  finalDraft,
}: DebateInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<"timeline" | "diff">("timeline");

  if (!isOpen) return null;

  const v1 = drafts && drafts.length > 0 ? drafts[0] : (
    `In today's fast-moving tech ecosystem, many companies are looking at ${topic}.\n\n` +
    `We have found that implementing modern AI pipelines requires careful coordination across multiple tools. ` +
    `When teams build without structured processes, they often run into unexpected bottlenecks.\n\n` +
    `Here are a few tips to keep in mind:\n- Make sure to test your prompts\n- Add error handling\n- Keep human oversight in the loop`
  );

  const critique1 = critiques && critiques.length > 0 ? critiques[0] : (
    "REJECTED: Opening line is generic corporate fluff ('In today's fast-moving...'). " +
    "Paragraphs lack punchy cadence and visual whitespace. " +
    "Action item: Inject a bold contrarian dollar-value hook, use high-contrast bullet structure, and eliminate filler words."
  );

  const v2 = drafts && drafts.length > 1 ? drafts[1] : finalDraft;

  // Simple word-level diff generator
  const computeWordDiff = (text1: string, text2: string) => {
    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);

    return {
      added: words2.filter(w => !set1.has(w)),
      removed: words1.filter(w => !set2.has(w)),
    };
  };

  const diffStats = computeWordDiff(v1, v2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Adversarial Debate Inspector</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                  {variantLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step LangGraph execution trace between SME Writer and Algorithm Hacker.
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

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "timeline"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Debate Round Timeline</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("diff")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "diff"
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <FileDiff className="w-3.5 h-3.5" />
            <span>Revision Text Diff (v1 vs v2)</span>
          </button>
        </div>

        {/* Tab 1: Timeline */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            {/* Step 1: SME Initial Draft */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                    1
                  </div>
                  <span className="text-xs font-bold text-white">SME Writer • Initial Pass (v1)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Unfiltered Draft</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-white/5 text-xs text-slate-300 font-sans whitespace-pre-line leading-relaxed">
                {v1}
              </div>
            </div>

            {/* Step 2: Hacker Critique */}
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-mono text-xs font-bold">
                    2
                  </div>
                  <span className="text-xs font-bold text-rose-300">Algorithm Hacker • Red-Team Critique</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400">
                  REJECTED & ROUTED BACK
                </span>
              </div>
              <div className="p-3 rounded-lg bg-black/40 border border-rose-500/20 text-xs text-rose-200 font-mono leading-relaxed">
                {critique1}
              </div>
            </div>

            {/* Step 3: SME Revised Final Draft */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                    3
                  </div>
                  <span className="text-xs font-bold text-emerald-300">SME Writer • Revised Pass (v2)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                  APPROVED FOR ARENA
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-emerald-500/20 text-xs text-slate-100 font-sans whitespace-pre-line leading-relaxed">
                {v2}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visual Diff */}
        {activeTab === "diff" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-slate-900/50 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">+{diffStats.added.length} words added</span>
                <span className="text-rose-400 font-bold">-{diffStats.removed.length} words removed</span>
              </div>
              <span className="text-slate-500">Corporate fluff eliminated, hook contrast injected</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-rose-500/20 bg-slate-950 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-mono text-rose-400">Draft v1 (Pre-Debate)</span>
                  <span className="text-[10px] font-mono text-slate-500">{v1.split(/\s+/).length} words</span>
                </div>
                <div className="text-xs text-slate-400 font-mono whitespace-pre-line leading-relaxed">
                  {v1}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/20 bg-slate-950 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-mono text-emerald-400">Draft v2 (Post-Hacker Polish)</span>
                  <span className="text-[10px] font-mono text-slate-500">{v2.split(/\s+/).length} words</span>
                </div>
                <div className="text-xs text-slate-200 font-mono whitespace-pre-line leading-relaxed">
                  {v2}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
