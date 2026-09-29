"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  Eraser, 
  Smile, 
  FileText 
} from "lucide-react";
import { auditContentAuthenticity } from "@/lib/api";

interface CringeLinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantLabel: string;
  currentText: string;
  onApplyDeFluff: (cleanText: string) => void;
}

export function CringeLinterModal({
  isOpen,
  onClose,
  variantLabel,
  currentText,
  onApplyDeFluff,
}: CringeLinterModalProps) {
  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDeFluffed, setIsDeFluffed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setIsDeFluffed(false);
    auditContentAuthenticity(currentText)
      .then((data) => setAuditData(data))
      .finally(() => setLoading(false));
  }, [isOpen, currentText]);

  if (!isOpen) return null;

  const score = auditData?.authenticity_score ?? 92;
  const grade = auditData?.grade ?? "S (Human-Crafted)";
  const cliches = auditData?.cliches_detected ?? [];
  const deFluffed = auditData?.de_fluffed_text ?? currentText;

  const handleApply = () => {
    onApplyDeFluff(deFluffed);
    setIsDeFluffed(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              score >= 80 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}>
              {score >= 80 ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">AI Cliché & Cringe Linter</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-slate-900 text-slate-300">
                  {variantLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audits against overused ChatGPT tropes, fluff phrases, and emoji density.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authenticity Score Card */}
        <div className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
              Human Authenticity Index
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-white">{score}%</span>
              <span className="text-xs font-mono text-emerald-400">{grade}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <div className="p-2 rounded-lg bg-slate-950 border border-white/5">
              <span>{cliches.length} AI Tropes</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950 border border-white/5">
              <span>{auditData?.emoji_count || 0} Emojis</span>
            </div>
          </div>
        </div>

        {/* Detected Clichés List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-300">
              Audit Findings & Replacements
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {cliches.length === 0 ? "Zero corporate tropes detected" : `${cliches.length} flagged phrases`}
            </span>
          </div>

          {cliches.length === 0 ? (
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Clean copy! Zero overused AI boilerplate phrases detected.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {cliches.map((item: any, idx: number) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl border border-amber-500/20 bg-slate-900/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-amber-300">"{item.phrase}"</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        {item.severity} SEVERITY
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Recommendation: <span className="text-cyan-300 font-mono">{item.suggestion}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* De-Fluffed Preview & Action */}
        {cliches.length > 0 && (
          <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-300 font-bold flex items-center gap-1.5">
                <Eraser className="w-3.5 h-3.5" />
                <span>Auto De-Fluffed Version Preview</span>
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 text-xs text-slate-200 font-sans whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {deFluffed}
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-xs font-bold font-mono text-white shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply De-Fluffed Version to Post</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            Close Linter
          </button>
        </div>
      </div>
    </div>
  );
}
