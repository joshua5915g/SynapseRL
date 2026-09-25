"use client";

import React from "react";
import { Check, Copy, Share2, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  label: "Candidate A" | "Candidate B";
  variantType: "The Contrarian Hook" | "The Engineering Blueprint";
  content: string;
  isSelected?: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function PostCard({
  label,
  variantType,
  content,
  isSelected,
  onSelect,
  disabled,
}: PostCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOptionA = label === "Candidate A";

  return (
    <div
      onClick={() => !disabled && onSelect()}
      className={`group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
        isSelected
          ? "border-2 border-indigo-500 bg-indigo-950/20 shadow-glow ring-2 ring-indigo-500/20"
          : "border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {/* Top Meta Header */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                isOptionA
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              }`}
            >
              {isOptionA ? "A" : "B"}
            </div>
            <div>
              <span className="font-semibold text-sm text-white">{label}</span>
              <span className="block text-xs text-slate-400">{variantType}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy post content"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <Badge variant={isOptionA ? "cyber" : "outline"} className="text-[11px]">
              {isOptionA ? "High Conviction" : "Deep Technical"}
            </Badge>
          </div>
        </div>

        {/* Mock Social Profile Context */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-indigo-400">
            AI
          </div>
          <div>
            <div className="text-xs font-medium text-slate-200 flex items-center gap-1">
              SynapseRL Executive Node <Sparkles className="w-3 h-3 text-indigo-400" />
            </div>
            <div className="text-[11px] text-slate-500">Autonomous Content Graph • Just now</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="whitespace-pre-line text-sm leading-relaxed text-slate-300 font-sans selection:bg-indigo-500/30">
          {content}
        </div>
      </div>

      {/* Footer Select Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono">
          {isSelected ? "✓ WINNER SELECTED" : "Click to select winner"}
        </span>
        <Button
          variant={isSelected ? "cyber" : "secondary"}
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? (
            <>
              <UserCheck className="w-4 h-4" /> Picked
            </>
          ) : (
            `Choose ${isOptionA ? "Option A" : "Option B"}`
          )}
        </Button>
      </div>
    </div>
  );
}
