"use client";

import React, { useState, useEffect, useRef } from "react";
import { CandidatePair, VotePayload, VoteResult } from "@/lib/types";
import { submitRLHFVote, fetchNextPair, generateNewPair } from "@/lib/api";
import { PostCard } from "./PostCard";
import { MicroTagPicker } from "./MicroTagPicker";
import { ArenaShortcuts } from "./ArenaShortcuts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Send, ThumbsUp, Scale, CheckCircle2 } from "lucide-react";

interface SwipeArenaProps {
  initialPair?: CandidatePair | null;
}

export function SwipeArena({ initialPair }: SwipeArenaProps) {
  const [currentPair, setCurrentPair] = useState<CandidatePair | null>(initialPair || null);
  const [selectedChoice, setSelectedChoice] = useState<"candidate_a" | "candidate_b" | "tie" | null>(null);
  const [microTags, setMicroTags] = useState<string[]>([]);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastVoteResult, setLastVoteResult] = useState<VoteResult | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Measure dwell time
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentPair?.id]);

  // Load pair if initialPair wasn't provided
  useEffect(() => {
    if (!currentPair) {
      loadNextPair();
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setSelectedChoice("candidate_a");
      } else if (e.key === "ArrowRight") {
        setSelectedChoice("candidate_b");
      } else if (e.key === " ") {
        e.preventDefault();
        setSelectedChoice("tie");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const loadNextPair = async () => {
    try {
      setLoading(true);
      const pair = await fetchNextPair();
      setCurrentPair(pair);
      setSelectedChoice(null);
      setMicroTags([]);
      setFeedbackNotes("");
    } catch (err) {
      console.error("Failed to fetch pair:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFresh = async () => {
    try {
      setGenerating(true);
      await generateNewPair("Enterprise AI Agents & Production RLHF Pipelines");
      await loadNextPair();
    } catch (err) {
      console.error("Failed to generate:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitVote = async () => {
    if (!currentPair || !selectedChoice) return;

    const dwellTime = Date.now() - startTimeRef.current;
    const payload: VotePayload = {
      pair_id: currentPair.id,
      chosen_id: selectedChoice,
      rejected_id: selectedChoice === "candidate_a" ? "candidate_b" : selectedChoice === "candidate_b" ? "candidate_a" : undefined,
      micro_tags: microTags,
      dwell_time_ms: dwellTime,
      confidence_rating: 4,
      feedback_notes: feedbackNotes || undefined,
    };

    try {
      setLoading(true);
      const result = await submitRLHFVote(payload);
      setLastVoteResult(result);
      setReviewedCount((prev) => prev + 1);
      await loadNextPair();
    } catch (err) {
      console.error("Error submitting vote:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> RLHF Pairwise Swipe Arena
            </h1>
            <Badge variant="cyber">DPO Calibration Mode</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Compare adversarial AI generations. Your feedback calibrates the offline reward model and fine-tunes future synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateFresh}
            disabled={generating || loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin text-indigo-400" : ""}`} />
            {generating ? "Debating & Generating..." : "Generate New Pair"}
          </Button>
          <ArenaShortcuts />
        </div>
      </div>

      {/* Target Topic Bar */}
      {currentPair && (
        <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500">PROMPT TOPIC:</span>
            <span className="text-sm font-semibold text-slate-200">{currentPair.topic}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono text-slate-500">AUDIENCE:</span>
            <span className="font-medium text-indigo-300">{currentPair.target_audience}</span>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Arena */}
      {currentPair ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PostCard
            label="Candidate A"
            variantType="The Contrarian Hook"
            content={currentPair.candidate_a}
            isSelected={selectedChoice === "candidate_a"}
            onSelect={() => setSelectedChoice("candidate_a")}
            disabled={loading}
          />
          <PostCard
            label="Candidate B"
            variantType="The Engineering Blueprint"
            content={currentPair.candidate_b}
            isSelected={selectedChoice === "candidate_b"}
            onSelect={() => setSelectedChoice("candidate_b")}
            disabled={loading}
          />
        </div>
      ) : (
        <div className="p-12 text-center glass-panel rounded-2xl flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm text-slate-300">Loading Candidate Pairs from Adversarial Engine...</p>
        </div>
      )}

      {/* Interactive Micro-Tags & Submission Control Panel */}
      {currentPair && (
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
          <MicroTagPicker
            selectedTags={microTags}
            onChange={setMicroTags}
            disabled={loading}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <Button
                variant={selectedChoice === "tie" ? "outline" : "ghost"}
                size="sm"
                onClick={() => setSelectedChoice("tie")}
                disabled={loading}
                className={selectedChoice === "tie" ? "border-amber-500 text-amber-300" : ""}
              >
                <Scale className="w-4 h-4 text-amber-400" />
                Declare Tie / Both Equal
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="cyber"
                size="md"
                onClick={handleSubmitVote}
                disabled={!selectedChoice || loading}
                className="px-8"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Commit Preference Vote
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Live Feedback Toast Notification */}
      {lastVoteResult && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Vote successfully recorded for pair <strong>{lastVoteResult.vote_id.slice(0, 8)}...</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Reward Delta: +{lastVoteResult.reward_delta}</span>
            <span>Total Pairs Evaluated: {lastVoteResult.total_pairs_reviewed}</span>
          </div>
        </div>
      )}
    </div>
  );
}
