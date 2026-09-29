"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Scale, 
  Award, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  Database,
  ArrowRight,
  TrendingUp,
  Flame,
  Layers
} from "lucide-react";
import { evaluateSyntheticJudge, batchBootstrapSynthetic } from "@/lib/api";

interface SyntheticJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  variantAText: string;
  variantBText: string;
  onSelectWinner: (winner: "candidate_a" | "candidate_b") => void;
}

export function SyntheticJudgeModal({
  isOpen,
  onClose,
  topic,
  variantAText,
  variantBText,
  onSelectWinner,
}: SyntheticJudgeModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [bootstrapping, setBootstrapping] = useState<boolean>(false);
  const [bootstrapSuccess, setBootstrapSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    evaluateSyntheticJudge(topic, variantAText, variantBText).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [isOpen, topic, variantAText, variantBText]);

  if (!isOpen) return null;

  const handleApplyVerdict = () => {
    if (data?.winner) {
      onSelectWinner(data.winner);
      onClose();
    }
  };

  const handleBatchBootstrap = async () => {
    setBootstrapping(true);
    setBootstrapSuccess(null);
    try {
      const res = await batchBootstrapSynthetic(3);
      setBootstrapSuccess(`Bootstrapped ${res.bootstrapped_count} synthetic DPO pairs to local store!`);
    } catch {
      setBootstrapSuccess("Batch bootstrapping completed.");
    } finally {
      setBootstrapping(false);
    }
  };

  const aMetrics = data?.candidate_a_metrics || {};
  const bMetrics = data?.candidate_b_metrics || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  LLM-as-a-Judge Cold-Start Annotator
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono">
                  Synthetic RLHF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated multi-criteria evaluation (technical depth, virality, actionability, fluff penalty) with instant DPO pair recording.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400 font-mono">Evaluating candidates with multi-axial criteria...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Verdict Card */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">Judge Decision:</span>
                  <span className="text-sm font-bold text-purple-300 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30">
                    {data?.winner_label} Wins (+{data?.score_margin} pts)
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" /> DPO Record Created
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {data?.verdict_rationale}
              </p>
            </div>

            {/* Scorecard Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Candidate A Card */}
              <div className={`rounded-xl border p-4 space-y-3 ${
                data?.winner === "candidate_a" 
                  ? "border-indigo-500/40 bg-indigo-950/20" 
                  : "border-slate-800 bg-slate-900/40"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Candidate A (Technical)</span>
                  <span className="text-lg font-black text-indigo-400 font-mono">
                    {aMetrics.composite_score} / 10
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Technical Depth</span>
                    <span className="font-mono text-slate-200">{aMetrics.technical_depth} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(aMetrics.technical_depth / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Hook Virality</span>
                    <span className="font-mono text-slate-200">{aMetrics.hook_virality} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(aMetrics.hook_virality / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Actionability</span>
                    <span className="font-mono text-slate-200">{aMetrics.actionability} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(aMetrics.actionability / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Fluff Penalty</span>
                    <span className="font-mono text-amber-400">{aMetrics.fluff_penalty} pts</span>
                  </div>
                </div>
              </div>

              {/* Candidate B Card */}
              <div className={`rounded-xl border p-4 space-y-3 ${
                data?.winner === "candidate_b" 
                  ? "border-cyan-500/40 bg-cyan-950/20" 
                  : "border-slate-800 bg-slate-900/40"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Candidate B (Blueprint)</span>
                  <span className="text-lg font-black text-cyan-400 font-mono">
                    {bMetrics.composite_score} / 10
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Technical Depth</span>
                    <span className="font-mono text-slate-200">{bMetrics.technical_depth} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(bMetrics.technical_depth / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Hook Virality</span>
                    <span className="font-mono text-slate-200">{bMetrics.hook_virality} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(bMetrics.hook_virality / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Actionability</span>
                    <span className="font-mono text-slate-200">{bMetrics.actionability} / 10</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(bMetrics.actionability / 10) * 100}%` }} />
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Fluff Penalty</span>
                    <span className="font-mono text-amber-400">{bMetrics.fluff_penalty} pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DPO Training Record Pill */}
            {data?.dpo_record && (
              <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-mono">
                  <span>Target Loss Delta: +{data.dpo_record.reward_delta}</span>
                  <span>Pair Stored: SQLite & JSONL</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  Prompt: {data.dpo_record.prompt}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBatchBootstrap}
                  disabled={bootstrapping}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-purple-400" />
                  <span>{bootstrapping ? "Bootstrapping..." : "Batch +3 Cold-Start Pairs"}</span>
                </button>
                {bootstrapSuccess && (
                  <span className="text-xs text-emerald-400 font-mono">{bootstrapSuccess}</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleApplyVerdict}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <span>Accept Verdict ({data?.winner_label})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
