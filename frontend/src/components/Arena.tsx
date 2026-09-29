"use client";

import React, { useState, useEffect } from "react";
import { 
  Award, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  RefreshCw, 
  Layers, 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Repeat2, 
  Send, 
  Eye, 
  SlidersHorizontal,
  Flame,
  Zap,
  TrendingUp,
  FileText,
  ShieldAlert,
  Workflow
} from "lucide-react";
import { GenerateABResponse } from "@/lib/types";
import { HookOptimizerModal } from "@/components/arena/HookOptimizerModal";
import { DebateInspectorModal } from "@/components/arena/DebateInspectorModal";
import { CringeLinterModal } from "@/components/arena/CringeLinterModal";

interface ArenaProps {
  generationData: GenerateABResponse;
  onSelectWinner: (winner: "candidate_a" | "candidate_b", dwellTimeMs: number) => void;
  onReset: () => void;
}

export function Arena({ generationData, onSelectWinner, onReset }: ArenaProps) {
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"technical" | "linkedin">("technical");
  const [hookModalTarget, setHookModalTarget] = useState<"A" | "B" | null>(null);
  const [debateModalTarget, setDebateModalTarget] = useState<"A" | "B" | null>(null);
  const [linterModalTarget, setLinterModalTarget] = useState<"A" | "B" | null>(null);
  const [variantAText, setVariantAText] = useState<string>(generationData.variant_a);
  const [variantBText, setVariantBText] = useState<string>(generationData.variant_b);



  useEffect(() => {
    setVariantAText(generationData.variant_a);
    setVariantBText(generationData.variant_b);
  }, [generationData]);

  const handleApplyNewHook = (target: "A" | "B", newHook: string) => {
    if (target === "A") {
      const lines = variantAText.split("\n");
      lines[0] = newHook;
      setVariantAText(lines.join("\n"));
    } else {
      const lines = variantBText.split("\n");
      lines[0] = newHook;
      setVariantBText(lines.join("\n"));
    }
  };

  const handleApplyDeFluff = (target: "A" | "B", cleanText: string) => {
    if (target === "A") {
      setVariantAText(cleanText);
    } else {
      setVariantBText(cleanText);
    }
  };



  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    setElapsedSeconds(0);

    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - now) / 1000));
    }, 500);

    return () => clearInterval(timer);
  }, [generationData]);

  // Keyboard navigation for voting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "1" || e.key === "ArrowLeft") {
        handleChoose("candidate_a");
      } else if (e.key === "2" || e.key === "ArrowRight") {
        handleChoose("candidate_b");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startTime]);

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
  const readTimeA = Math.max(1, Math.round((wordCountA / 200) * 60));
  const readTimeB = Math.max(1, Math.round((wordCountB / 200) * 60));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Arena Top Navigation & Telemetry Bar */}
      <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-950/60 text-xs font-mono text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Prompt</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                Active Evaluation Topic
              </span>
              {generationData.provider_used && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 uppercase">
                  {generationData.provider_used}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1">
              "{generationData.topic}"
            </h2>
          </div>
        </div>


        {/* View Mode Switch & Dwell Timer */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("technical")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "technical"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Technical Review</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("linkedin")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === "linkedin"
                  ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>LinkedIn Feed Mockup</span>
            </button>
          </div>

          {/* Dwell Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Dwell: <strong className="text-white font-mono">{elapsedSeconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Arena Battle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VARIANT A CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/30 bg-[#0c1222]/80 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/60 hover:shadow-glow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 font-mono font-bold text-sm border border-indigo-500/40 shadow-sm">
                  A
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Candidate A</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Contrarian Hook
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Tension-Driven • High Virality</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{wordCountA} words • {readTimeA}s</span>
                <button
                  type="button"
                  onClick={() => setHookModalTarget("A")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono transition-all cursor-pointer"
                  title="Optimize opening hook virality"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hook (Virality)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDebateModalTarget("A")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono transition-all cursor-pointer"
                  title="Inspect Adversarial Debate Traces & Diffs"
                >
                  <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Debate Trace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLinterModalTarget("A")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
                  title="Scan for AI Buzzwords & Corporate Clichés"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cringe Linter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(variantAText, "A")}


                  className="p-2 rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Copy to clipboard"
                  aria-label="Copy Candidate A content"
                >
                  {copiedVariant === "A" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Body Rendering */}
            {viewMode === "technical" ? (
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-5 text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-6 select-text min-h-[300px]">
                {variantAText}
              </div>
            ) : (
              /* LinkedIn Mockup Card */
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] p-5 mb-6 text-slate-200 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs">
                    SR
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Alex Mercer • 1st</div>
                    <div className="text-[11px] text-slate-400">Principal Distributed Systems Architect @ SynapseRL</div>
                    <div className="text-[10px] text-slate-500">Just now • 🌐</div>
                  </div>
                </div>

                <div className="text-sm text-slate-100 whitespace-pre-line leading-relaxed border-t border-slate-800/80 pt-3">
                  {variantAText}
                </div>


                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer">
                    <ThumbsUp className="w-4 h-4" /> Like
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> Comment
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer">
                    <Repeat2 className="w-4 h-4" /> Repost
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer">
                    <Send className="w-4 h-4" /> Send
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Winner Vote CTA */}
          <button
            type="button"
            onClick={() => handleChoose("candidate_a")}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3.5 font-semibold text-sm sm:text-base text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-cyan-300" />
            <span>Select Candidate A as Winner</span>
            <span className="text-xs font-mono opacity-70 bg-black/20 px-2 py-0.5 rounded">Key: 1 or ←</span>
          </button>
        </div>

        {/* VARIANT B CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-cyan-500/30 bg-[#0c1222]/80 p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/60 hover:shadow-glow-cyan relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500"></div>

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/40 shadow-sm">
                  B
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Candidate B</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Engineering Blueprint
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">System Centric • High Retention</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">{wordCountB} words • {readTimeB}s</span>
                <button
                  type="button"
                  onClick={() => setHookModalTarget("B")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
                  title="Optimize opening hook virality"
                >
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hook (Virality)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDebateModalTarget("B")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono transition-all cursor-pointer"
                  title="Inspect Adversarial Debate Traces & Diffs"
                >
                  <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Debate Trace</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLinterModalTarget("B")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono transition-all cursor-pointer"
                  title="Scan for AI Buzzwords & Corporate Clichés"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cringe Linter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(variantBText, "B")}
                  className="p-2 rounded-xl border border-white/10 bg-slate-950/60 text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                  title="Copy to clipboard"
                  aria-label="Copy Candidate B content"
                >
                  {copiedVariant === "B" ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Body Rendering */}
            {viewMode === "technical" ? (
              <div className="rounded-xl border border-white/5 bg-slate-950/60 p-5 text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-6 select-text min-h-[300px]">
                {variantBText}
              </div>
            ) : (
              /* LinkedIn Mockup Card */
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] p-5 mb-6 text-slate-200 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center font-bold text-white text-xs">
                    SR
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Alex Mercer • 1st</div>
                    <div className="text-[11px] text-slate-400">Principal Distributed Systems Architect @ SynapseRL</div>
                    <div className="text-[10px] text-slate-500">Just now • 🌐</div>
                  </div>
                </div>

                <div className="text-sm text-slate-100 whitespace-pre-line leading-relaxed border-t border-slate-800/80 pt-3">
                  {variantBText}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                    <ThumbsUp className="w-4 h-4" /> Like
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                    <MessageSquare className="w-4 h-4" /> Comment
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                    <Repeat2 className="w-4 h-4" /> Repost
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
                    <Send className="w-4 h-4" /> Send
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Winner Vote CTA */}
          <button
            type="button"
            onClick={() => handleChoose("candidate_b")}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 py-3.5 font-semibold text-sm sm:text-base text-white shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Select Candidate B as Winner</span>
            <span className="text-xs font-mono opacity-70 bg-black/20 px-2 py-0.5 rounded">Key: 2 or →</span>
          </button>
        </div>
      </div>

      {/* Hook Optimizer Modal */}
      {hookModalTarget && (
        <HookOptimizerModal
          isOpen={hookModalTarget !== null}
          onClose={() => setHookModalTarget(null)}
          variantLabel={`Candidate ${hookModalTarget}`}
          currentText={hookModalTarget === "A" ? variantAText : variantBText}
          topic={generationData.topic}
          onApplyHook={(newHook) => handleApplyNewHook(hookModalTarget, newHook)}
        />
      )}

      {/* Debate Trace & Diff Inspector Modal */}
      {debateModalTarget && (
        <DebateInspectorModal
          isOpen={debateModalTarget !== null}
          onClose={() => setDebateModalTarget(null)}
          variantLabel={`Candidate ${debateModalTarget}`}
          topic={generationData.topic}
          drafts={debateModalTarget === "A" ? (generationData.drafts_a || []) : (generationData.drafts_b || [])}
          critiques={debateModalTarget === "A" ? (generationData.critiques_a || []) : (generationData.critiques_b || [])}
          finalDraft={debateModalTarget === "A" ? variantAText : variantBText}
        />
      )}

      {/* Cringe Linter Modal */}
      {linterModalTarget && (
        <CringeLinterModal
          isOpen={linterModalTarget !== null}
          onClose={() => setLinterModalTarget(null)}
          variantLabel={`Candidate ${linterModalTarget}`}
          currentText={linterModalTarget === "A" ? variantAText : variantBText}
          onApplyDeFluff={(clean) => handleApplyDeFluff(linterModalTarget, clean)}
        />
      )}
    </div>
  );
}



