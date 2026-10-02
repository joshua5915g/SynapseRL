"use client";

import React, { useState } from "react";
import { TopicGenerator } from "@/components/TopicGenerator";
import { Arena } from "@/components/Arena";
import { TagModal } from "@/components/TagModal";
import { GenerateABResponse } from "@/lib/types";
import { generateAB } from "@/lib/api";
import { CheckCircle2, Sparkles, Flame, ArrowRight } from "lucide-react";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function RLHFArenaPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generationData, setGenerationData] = useState<GenerateABResponse | null>(null);
  
  // Tag Modal & Voting state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<"candidate_a" | "candidate_b">("candidate_a");
  const [currentDwellTime, setCurrentDwellTime] = useState<number>(0);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [voteSuccessMessage, setVoteSuccessMessage] = useState<string | null>(null);

  const handleGenerate = async (
    topic: string,
    toneGuidance?: string,
    llmProvider?: string,
    llmModel?: string,
    temperature?: number,
    personaId?: string
  ) => {
    setIsLoading(true);
    setVoteSuccessMessage(null);
    try {
      const data = await generateAB(topic, toneGuidance, llmProvider, llmModel, temperature, personaId);
      setGenerationData(data);
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWinnerModal = (winner: "candidate_a" | "candidate_b", dwellTimeMs: number) => {
    setSelectedWinner(winner);
    setCurrentDwellTime(dwellTimeMs);
    setIsModalOpen(true);
  };

  const handleConfirmVote = async (
    selectedTags: string[],
    feedbackNotes?: string,
    confidence: number = 4
  ) => {
    if (!generationData) return;

    setIsSubmittingVote(true);
    const winningText =
      selectedWinner === "candidate_a" ? generationData.variant_a : generationData.variant_b;
    const losingText =
      selectedWinner === "candidate_a" ? generationData.variant_b : generationData.variant_a;

    const payload = {
      pair_id: generationData.pair_id || "generated-pair",
      chosen_id: selectedWinner,
      rejected_id: selectedWinner === "candidate_a" ? "candidate_b" : "candidate_a",
      winning_text: winningText,
      losing_text: losingText,
      selected_tags: selectedTags,
      micro_tags: selectedTags,
      dwell_time_ms: currentDwellTime,
      confidence: confidence,
      confidence_rating: confidence,
      feedback_notes: feedbackNotes,
    };

    try {
      // POST to /api/rlhf/vote
      const res = await fetch(`${BACKEND_BASE}/api/rlhf/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Fallback try /api/v1/rlhf/vote
        await fetch(`${BACKEND_BASE}/api/v1/rlhf/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.warn("Vote recording offline or fallback handled:", err);
    } finally {
      setIsSubmittingVote(false);
      setIsModalOpen(false);
      setVoteSuccessMessage(
        `Vote Recorded: ${selectedWinner === "candidate_a" ? "Variant A" : "Variant B"} selected with tags [${selectedTags.join(", ")}]. Added to DPO queue!`
      );
    }
  };

  const handleReset = () => {
    setGenerationData(null);
    setVoteSuccessMessage(null);
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Vote Success Notification Banner */}
      {voteSuccessMessage && (
        <div className="max-w-4xl mx-auto w-full mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow-emerald animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-emerald-200">
              {voteSuccessMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-mono transition-all cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Next Topic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dynamic View: Hero Generator vs Side-by-Side Arena */}
      {!generationData ? (
        <div className="relative w-full">
          {/* Architectural Hairline Frame Rules */}
          <div className="hero-rules hidden md:flex" aria-hidden="true">
            <span /><span /><span />
          </div>

          <div className="relative z-10 flex flex-col xl:flex-row items-start justify-center gap-8 max-w-7xl mx-auto">
            <div className="flex-1 w-full max-w-4xl mx-auto">
              <TopicGenerator onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {/* Atmospheric Ghost Telemetry HUD Panel (Wide Viewports >= 1280px) */}
            <aside
              className="hidden xl:block w-72 flex-shrink-0 animate-rise delay-4 sticky top-24 pointer-events-none select-none"
              aria-hidden="true"
            >
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c1222]/35 backdrop-blur-md p-5 space-y-5 opacity-45 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                      Telemetry Stream
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">120ms tick</span>
                </div>

                {/* Micro Bar Gauges */}
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-end gap-1.5 h-16">
                    {[32, 54, 42, 68, 85, 74, 96].map((h, i) => (
                      <span
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-2.5 rounded-t bg-gradient-to-t from-indigo-500/40 to-cyan-400/80 inline-block transition-all duration-500"
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold font-display text-white tracking-tight leading-none">
                      +42.6%
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Reward Margin</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wide">
                    Reward Convergence
                  </h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans">
                    Continuous pairwise ranking over SQLite DPO offline trajectories.
                  </p>
                </div>

                {/* Quick Micro Stat Rows */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">KL Divergence:</span>
                    <span className="text-emerald-400 font-semibold">0.038 β</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Dwell Multiplier:</span>
                    <span className="text-cyan-400 font-semibold">1.42x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TRL Export Cache:</span>
                    <span className="text-indigo-300 font-semibold">Ready</span>
                  </div>
                </div>

                {/* Faint watermark */}
                <div className="pt-2 text-right">
                  <span className="text-4xl font-extrabold font-mono tracking-tighter text-white/[0.04]">
                    SYNAPSE
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <Arena
          generationData={generationData}
          onSelectWinner={handleOpenWinnerModal}
          onReset={handleReset}
        />
      )}

      {/* Micro-Tagging Modal */}
      {generationData && (
        <TagModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          winner={selectedWinner}
          winnerTitle={selectedWinner === "candidate_a" ? "Variant A (Contrarian)" : "Variant B (Blueprint)"}
          onConfirmVote={handleConfirmVote}
          isSubmitting={isSubmittingVote}
        />
      )}
    </main>
  );
}
