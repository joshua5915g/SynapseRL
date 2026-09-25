"use client";

import React, { useState } from "react";
import { X, Check, Award, Tag, Sparkles, MessageSquare } from "lucide-react";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: "candidate_a" | "candidate_b";
  winnerTitle: string;
  onConfirmVote: (selectedTags: string[], feedbackNotes?: string, confidence?: number) => void;
  isSubmitting?: boolean;
}

const DEFAULT_QUICK_TAGS = [
  "Punchier Hook",
  "More Technical",
  "Less Corporate",
  "Better Call-to-Action",
  "Higher Dwell-Time Potential",
  "Stronger Contrarian Take",
];

export function TagModal({
  isOpen,
  onClose,
  winner,
  winnerTitle,
  onConfirmVote,
  isSubmitting = false,
}: TagModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(["Punchier Hook"]);
  const [feedback, setFeedback] = useState("");
  const [confidence, setConfidence] = useState<number>(4);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleConfirm = () => {
    onConfirmVote(selectedTags, feedback.trim() || undefined, confidence);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/80">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">RLHF Preference Calibration</h3>
            <p className="text-xs font-mono text-slate-400">
              Selected Winner:{" "}
              <span className="text-cyan-400 font-semibold">{winnerTitle}</span>
            </p>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-200 mb-1">
            Why did this variant win?
          </label>
          <p className="text-xs text-slate-400">
            Micro-tagging directly guides the DPO reward penalty matrices.
          </p>
        </div>

        {/* Quick Tag Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {DEFAULT_QUICK_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 shadow-glow"
                    : "border-white/10 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{tag}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            );
          })}
        </div>

        {/* Confidence Rating (1 to 5) */}
        <div className="mb-5">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
            <span>Decision Conviction</span>
            <span className="text-indigo-400">{confidence} / 5 Stars</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setConfidence(star)}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  confidence >= star
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold"
                    : "border-white/5 bg-slate-950/40 text-slate-500 hover:border-white/20"
                }`}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>

        {/* Optional Notes */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Optional Engineer Notes</span>
          </div>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Tone in paragraph 2 had higher authentic conviction..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 py-3 text-sm font-medium text-slate-300 hover:bg-slate-950 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || selectedTags.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{isSubmitting ? "Recording Vote..." : "Confirm Vote"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
