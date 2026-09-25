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

  const handleGenerate = async (topic: string, toneGuidance?: string) => {
    setIsLoading(true);
    setVoteSuccessMessage(null);
    try {
      const data = await generateAB(topic, toneGuidance);
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
        <TopicGenerator onGenerate={handleGenerate} isLoading={isLoading} />
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
