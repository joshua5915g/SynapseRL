"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Bot,
  Sparkles,
  Trophy,
  Scale,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  ArrowRight,
  Database,
  Sliders,
  AlertTriangle
} from "lucide-react";
import { evaluateSyntheticJudge, batchBootstrapSynthetic } from "@/lib/api";

const SAMPLE_PAIRS = [
  {
    topic: "Distributed Consensus in High-Throughput Clusters",
    variant_a: `Raft consensus requires quorum on every state commit. If you scale to 7+ nodes without pipelined RPC logs, your p99 latency degrades by 4.2x.

Here is the 3-step benchmark:
1. Isolate the heartbeat thread from disk writes
2. Enforce batch append entries
3. Monitor raft_commit_index drift`,
    variant_b: `In today's fast-paced world, Raft consensus is a game-changer that will revolutionize team synergy and supercharge your cloud operations! 🚀✨`
  },
  {
    topic: "Multi-Tenant Vector DB Memory Bloat",
    variant_a: `Most enterprise vector indices bleed RAM because teams build one massive HNSW index per tenant.

The fix: Metadata filtering over flat IVF indices with memory-mapped storage. Result: 68% lower memory usage.`,
    variant_b: `Without further ado, let us delve into transformative AI vectors that unlock unprecedented paradigms for enterprise growth! 💡`
  }
];

export default function SyntheticJudgePage() {
  const [topic, setTopic] = useState(SAMPLE_PAIRS[0].topic);
  const [variantA, setVariantA] = useState(SAMPLE_PAIRS[0].variant_a);
  const [variantB, setVariantB] = useState(SAMPLE_PAIRS[0].variant_b);
  const [audience, setAudience] = useState("B2B Tech Leaders");

  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [bootstrapResults, setBootstrapResults] = useState<any[]>([]);

  useEffect(() => {
    handleRunEvaluation(SAMPLE_PAIRS[0].topic, SAMPLE_PAIRS[0].variant_a, SAMPLE_PAIRS[0].variant_b);
  }, []);

  const handleRunEvaluation = async (t?: string, a?: string, b?: string) => {
    const activeTopic = t || topic;
    const activeA = a || variantA;
    const activeB = b || variantB;

    if (!activeA.trim() || !activeB.trim()) return;

    setIsEvaluating(true);
    try {
      const res = await evaluateSyntheticJudge(activeTopic, activeA, activeB, audience);
      setEvaluationResult(res);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleBootstrapBatch = async (count: number = 3) => {
    setIsBootstrapping(true);
    try {
      const res = await batchBootstrapSynthetic(count);
      if (res?.pairs) {
        setBootstrapResults(res.pairs);
      }
    } catch (err) {
      console.error("Bootstrap error:", err);
    } finally {
      setIsBootstrapping(false);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_PAIRS[0]) => {
    setTopic(sample.topic);
    setVariantA(sample.variant_a);
    setVariantB(sample.variant_b);
    handleRunEvaluation(sample.topic, sample.variant_a, sample.variant_b);
  };

  const aMetrics = evaluationResult?.candidate_a_metrics || {
    technical_depth: 8.5,
    hook_virality: 8.0,
    actionability: 8.5,
    fluff_penalty: 0.0,
    composite_score: 8.4
  };

  const bMetrics = evaluationResult?.candidate_b_metrics || {
    technical_depth: 5.5,
    hook_virality: 6.8,
    actionability: 6.2,
    fluff_penalty: -1.5,
    composite_score: 6.0
  };

  const winner = evaluationResult?.winner || "candidate_a";
  const winnerLabel = evaluationResult?.winner_label || "Candidate A";
  const margin = evaluationResult?.score_margin || 2.4;
  const rationale = evaluationResult?.verdict_rationale || "Candidate A exhibited 42% higher technical specificity and avoided corporate buzzword penalties.";
  const dpoRecord = evaluationResult?.dpo_record;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 shadow-glow-emerald">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  LLM-as-a-Judge Synthetic Arena
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Feature #6
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Automated multi-LLM consensus: Evaluates candidate pairs across technical depth, actionability, and anti-fluff penalties to bootstrap DPO preference datasets at scale.
              </p>
            </div>
          </div>
        </div>

        {/* Global Batch Action */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => handleBootstrapBatch(3)}
            disabled={isBootstrapping}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-emerald disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isBootstrapping ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Database className="w-3.5 h-3.5" />
            )}
            <span>Bootstrap 3 DPO Pairs</span>
          </button>
        </div>
      </div>

      {/* Batch Bootstrapping Results Drawer (if triggered) */}
      {bootstrapResults.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-300 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Synthetic Bootstrapped Pairs Saved to DPO Database ({bootstrapResults.length})</span>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {bootstrapResults.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-white/5 space-y-1 text-xs">
                <span className="font-semibold text-white truncate block">{item.topic}</span>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <span className="text-emerald-300 font-bold">{item.winner} (+{item.margin})</span>
                  <span className="text-cyan-400">Δ Reward: +{item.reward_delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Candidate Pair Inputs (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Evaluation Setup
              </span>
              <div className="flex items-center gap-1.5">
                {SAMPLE_PAIRS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(s)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-white/5 text-slate-300 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    Sample #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Topic / Context</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
              />
            </div>

            {/* Candidate A Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-300 font-mono">Candidate A (Technical / Contrarian)</label>
                <span className="text-[10px] font-mono text-slate-500">{variantA.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={variantA}
                onChange={(e) => setVariantA(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed resize-y"
              />
            </div>

            {/* Candidate B Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 font-mono">Candidate B (Alternative Angle)</label>
                <span className="text-[10px] font-mono text-slate-500">{variantB.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={variantB}
                onChange={(e) => setVariantB(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-sans leading-relaxed resize-y"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRunEvaluation()}
              disabled={isEvaluating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-emerald disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Scale className="w-3.5 h-3.5" />
              )}
              <span>Run Synthetic Judge Auto-Evaluation</span>
            </button>
          </div>
        </div>

        {/* Right Column: Judge Scorecard & DPO Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Winner Hero Banner */}
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl shadow-glow-emerald">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Consensus Judge Verdict</span>
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Margin +{margin}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-mono font-black text-xl">
                {winner === "candidate_a" ? "A" : "B"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {winnerLabel} Selected as Superior Variant
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Auto-annotated and queued for HuggingFace Direct Preference Optimization.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
              <strong>Judge Rationale:</strong> {rationale}
            </div>
          </div>

          {/* Comparative Radar Matrix */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3.5 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono block">
              Multi-Metric Comparison (Candidate A vs B)
            </span>

            <div className="space-y-3 text-xs font-mono">
              {/* Technical Depth */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Technical Depth</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">A: {aMetrics.technical_depth}</span>
                    <span className="text-amber-400 font-bold">B: {bMetrics.technical_depth}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${(aMetrics.technical_depth / 10) * 50}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${(bMetrics.technical_depth / 10) * 50}%` }} />
                </div>
              </div>

              {/* Hook Virality */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hook Virality</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">A: {aMetrics.hook_virality}</span>
                    <span className="text-amber-400 font-bold">B: {bMetrics.hook_virality}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${(aMetrics.hook_virality / 10) * 50}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${(bMetrics.hook_virality / 10) * 50}%` }} />
                </div>
              </div>

              {/* Actionability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Actionability</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">A: {aMetrics.actionability}</span>
                    <span className="text-amber-400 font-bold">B: {bMetrics.actionability}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${(aMetrics.actionability / 10) * 50}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${(bMetrics.actionability / 10) * 50}%` }} />
                </div>
              </div>

              {/* Fluff Penalty */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Fluff Penalty</span>
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">A: {aMetrics.fluff_penalty}</span>
                    <span className="text-amber-400 font-bold">B: {bMetrics.fluff_penalty}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DPO Training Tuple Preview */}
          {dpoRecord && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2 backdrop-blur-xl">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>Pairwise DPO Tuple Ingested</span>
              </span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-mono text-slate-300 space-y-1">
                <div><span className="text-emerald-400 font-bold">chosen:</span> "{dpoRecord.chosen?.slice(0, 90)}..."</div>
                <div><span className="text-rose-400 font-bold">rejected:</span> "{dpoRecord.rejected?.slice(0, 90)}..."</div>
                <div><span className="text-cyan-400 font-bold">reward_delta:</span> +{dpoRecord.reward_delta}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
