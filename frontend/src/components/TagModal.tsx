"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Award, Tag, Sparkles, MessageSquare, Zap, Shield, Flame, Scale } from "lucide-react";

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: "candidate_a" | "candidate_b";
  winnerTitle: string;
  onConfirmVote: (selectedTags: string[], feedbackNotes?: string, confidence?: number) => void;
  isSubmitting?: boolean;
}

interface TagGroup {
  category: string;
  icon: any;
  tags: string[];
}

const TAG_GROUPS: TagGroup[] = [
  {
    category: "Hook & Attention Dynamics",
    icon: Flame,
    tags: ["Punchier Hook", "Higher Dwell Potential", "Stronger Contrarian Take", "Zero Corporate Fluff"],
  },
  {
    category: "Technical & Architectural Depth",
    icon: Zap,
    tags: ["Deeper Engineering Proof", "Better System Framework", "More Actionable", "Accurate Mental Model"],
  },
  {
    category: "Executive & B2B Fit",
    icon: Shield,
    tags: ["C-Suite High Leverage", "Stronger ROI Framing", "Clearer Call-to-Action", "Better Formatting & Rhythm"],
  },
];

const CONFIDENCE_LEVELS = [
  { level: 1, label: "Marginal Edge" },
  { level: 2, label: "Slight Preference" },
  { level: 3, label: "Clear Winner" },
  { level: 4, label: "Strong Conviction" },
  { level: 5, label: "Decisive Knockout" },
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

  // Close on Escape, confirm on Enter
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleConfirm = () => {
    onConfirmVote(selectedTags, feedback.trim() || undefined, confidence);
  };

  const isCandidateA = winner === "candidate_a";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0c1222]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/80 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calibration-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/[0.08]">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            isCandidateA 
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" 
              : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
          }`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 id="calibration-title" className="text-xl font-bold text-white tracking-tight">
              RLHF Preference Calibration
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Target Pair Winner:{" "}
              <span className={`font-semibold ${isCandidateA ? "text-indigo-400" : "text-cyan-400"}`}>
                {winnerTitle}
              </span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
            Qualitative Micro-Tags for DPO Loss
          </label>
          <p className="text-xs text-slate-400">
            Selected tags are serialized into the DPO reward penalty loss tensor to weight future generation passes.
          </p>
        </div>

        {/* Categorized Tag Chips */}
        <div className="space-y-4 mb-6">
          {TAG_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.category} className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <GroupIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 shadow-sm shadow-indigo-500/20"
                            : "border-white/[0.08] bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-white/20"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                        {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Decision Conviction Rating */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-2.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Decision Conviction Rating:</span>
            <span className="text-indigo-400 font-semibold">
              {confidence}/5 • {CONFIDENCE_LEVELS[confidence - 1]?.label}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {CONFIDENCE_LEVELS.map((item) => (
              <button
                key={item.level}
                type="button"
                onClick={() => setConfidence(item.level)}
                className={`py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  confidence >= item.level
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-bold"
                    : "border-white/5 bg-slate-900/60 text-slate-500 hover:border-white/20"
                }`}
              >
                {item.level}★
              </button>
            ))}
          </div>
        </div>

        {/* Engineer Notes */}
        <div className="mb-6">
          <label htmlFor="engineer-notes" className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Optional Qualitative Feedback Notes</span>
          </label>
          <input
            id="engineer-notes"
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. Opening hook created immediate curiosity gap without sounding sensationalist..."
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 py-3 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || selectedTags.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{isSubmitting ? "Serializing to DPO..." : "Confirm & Commit Vote"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
