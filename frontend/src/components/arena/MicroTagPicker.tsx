"use client";

import React from "react";
import { Tag, AlertCircle, Zap, ShieldAlert, Sparkles, FileText } from "lucide-react";

interface MicroTagPickerProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

const AVAILABLE_TAGS = [
  { id: "too_corporate", label: "Too Corporate", icon: ShieldAlert, color: "hover:border-rose-500/50 hover:bg-rose-950/20" },
  { id: "weak_hook", label: "Weak Hook", icon: AlertCircle, color: "hover:border-amber-500/50 hover:bg-amber-950/20" },
  { id: "hallucination", label: "Hallucinatory", icon: AlertCircle, color: "hover:border-rose-500/50 hover:bg-rose-950/20" },
  { id: "high_signal", label: "High Signal", icon: Zap, color: "hover:border-emerald-500/50 hover:bg-emerald-950/20" },
  { id: "actionable", label: "Actionable Blueprint", icon: Sparkles, color: "hover:border-indigo-500/50 hover:bg-indigo-950/20" },
  { id: "too_wordy", label: "Too Wordy", icon: FileText, color: "hover:border-amber-500/50 hover:bg-amber-950/20" },
];

export function MicroTagPicker({ selectedTags, onChange, disabled }: MicroTagPickerProps) {
  const toggleTag = (id: string) => {
    if (disabled) return;
    if (selectedTags.includes(id)) {
      onChange(selectedTags.filter((t) => t !== id));
    } else {
      onChange([...selectedTags, id]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <Tag className="w-3.5 h-3.5 text-indigo-400" /> Apply Qualitative Micro-Tags (Optional):
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          {selectedTags.length} active
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag.id);
          const Icon = tag.icon;
          return (
            <button
              key={tag.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleTag(tag.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSelected
                  ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-sm shadow-indigo-500/20"
                  : `bg-slate-900/80 border-slate-800 text-slate-400 ${tag.color}`
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon className="w-3 h-3" />
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
