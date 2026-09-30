"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Zap,
  Smile,
  Type,
  TrendingUp,
  Sliders,
  Layers
} from "lucide-react";
import { auditContentAuthenticity } from "@/lib/api";

const CRINGE_SAMPLE = `In today's fast-paced world, I am thrilled to announce that our team is proud to revolutionize the enterprise AI tapestry.

Without further ado, let's delve deep into our transformative synergy that will move the needle and unlock unprecedented paradigm shifts for your team.

At the end of the day, our game-changer is a testament to what happens when you double down on excellence. 🚀🔥✨🎉💡`;

const AUTHENTIC_SAMPLE = `Most teams building RAG architectures are making a $200k mistake:

They treat LLMs like deterministic databases instead of stochastic reasoning engines.

If you don't enforce strict JSON schema sandboxing and adversarial validation loops at the agent layer, your p99 failure rate will compound silently.

Here is the 3-step audit we run before any agentic state commit:
1. Pydantic v2 input validation with hard type constraints
2. Dual-agent critique loop before SQL execution
3. Human-in-the-loop review for edge-case divergence

What is your team's biggest state bottleneck right now?`;

export default function LinterStudioPage() {
  const [inputText, setInputText] = useState(CRINGE_SAMPLE);
  const [auditData, setAuditData] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedClean, setCopiedClean] = useState(false);
  const [activeTab, setActiveTab] = useState<"diff" | "clean">("diff");

  useEffect(() => {
    handleRunAudit(CRINGE_SAMPLE);
  }, []);

  const handleRunAudit = async (textToAudit?: string) => {
    const text = textToAudit !== undefined ? textToAudit : inputText;
    if (!text.trim()) return;

    setIsAuditing(true);
    try {
      const data = await auditContentAuthenticity(text);
      setAuditData(data);
    } catch (err) {
      console.error("Linter audit error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyCleanText = () => {
    if (auditData?.de_fluffed_text) {
      setInputText(auditData.de_fluffed_text);
      handleRunAudit(auditData.de_fluffed_text);
    }
  };

  const handleCopy = (text: string, type: "orig" | "clean") => {
    navigator.clipboard.writeText(text);
    if (type === "orig") {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedClean(true);
      setTimeout(() => setCopiedClean(false), 2000);
    }
  };

  const score = auditData?.authenticity_score ?? 50;
  const grade = auditData?.grade ?? "B (Review Required)";
  const status = auditData?.status ?? "WARNING";
  const cliches = auditData?.cliches_detected ?? [];
  const emojiCount = auditData?.emoji_count ?? 0;
  const cleanedText = auditData?.de_fluffed_text ?? inputText;

  const scoreColor =
    score >= 85
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : score >= 70
      ? "text-sky-400 border-sky-500/40 bg-sky-500/10"
      : score >= 55
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-rose-500/30 text-rose-400 shadow-glow-rose">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Corporate Cliché Hunter & Authenticity Linter
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  Feature #2
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Live AI fluff scanner: Flags banned buzzwords, detects emoji spam, computes authenticity index, and provides surgical 1-click de-fluffing.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setInputText(CRINGE_SAMPLE);
              handleRunAudit(CRINGE_SAMPLE);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-mono transition-all cursor-pointer"
          >
            Load Cringe AI Sample
          </button>
          <button
            type="button"
            onClick={() => {
              setInputText(AUTHENTIC_SAMPLE);
              handleRunAudit(AUTHENTIC_SAMPLE);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 text-xs font-mono transition-all cursor-pointer"
          >
            Load Authentic B2B Sample
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Authenticity Score */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Authenticity Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${scoreColor.split(" ")[0]}`}>
                {score}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-xl border font-bold font-mono text-sm ${scoreColor}`}>
            {status}
          </div>
        </div>

        {/* Metric 2: Grade Rating */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Quality Tier
          </span>
          <p className="text-sm sm:text-base font-bold text-white mt-2 truncate font-mono">
            {grade}
          </p>
        </div>

        {/* Metric 3: Flagged Buzzwords */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Flagged Clichés
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-1 block">
              {cliches.length}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Emoji Density */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Emoji Count
            </span>
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono mt-1 block ${emojiCount > 3 ? "text-amber-400" : "text-slate-200"}`}>
              {emojiCount}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Smile className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Editor & Cliché Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-rose-400" />
                <span>Draft Inspector</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                {inputText.length} chars • {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={9}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleRunAudit(e.target.value);
              }}
              placeholder="Paste your B2B article, LinkedIn draft, or post text here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-500/50 transition-colors font-sans leading-relaxed resize-y"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleRunAudit()}
                disabled={isAuditing}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold transition-all shadow-glow-rose cursor-pointer flex items-center gap-2"
              >
                {isAuditing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>Re-Scan Fluff</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopy(inputText, "orig")}
                className="px-3 py-2 rounded-xl border border-white/10 bg-slate-950 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Draft</span>
              </button>
            </div>
          </div>

          {/* Cliché Breakdown Table */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                Flagged Corporate Clichés ({cliches.length})
              </span>
              {cliches.length === 0 && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero AI Clichés Detected</span>
                </span>
              )}
            </div>

            {cliches.length > 0 ? (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {cliches.map((c: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-white/5 bg-slate-950/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-300 font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          "{c.phrase}"
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                          c.severity === "HIGH" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                          {c.severity}
                        </span>
                        <span className="text-slate-500 text-[11px] font-mono">
                          ({c.occurrences}x)
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Suggestion: <span className="text-emerald-300 font-medium">{c.suggestion}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-emerald-300 font-mono">
                  Clean B2B Voice Verified
                </p>
                <p className="text-[11px] text-slate-400">
                  No empty buzzwords, corporate tropes, or AI markers detected in this draft.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Surgical De-Fluffer & Comparison (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl shadow-glow-emerald">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Surgical 1-Click De-Fluffed Output</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyCleanText}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Apply to Draft</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 min-h-[220px] text-xs sm:text-sm text-slate-100 font-sans leading-relaxed whitespace-pre-line">
              {cleanedText}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleCopy(cleanedText, "clean")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
              >
                {copiedClean ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedClean ? "Copied Clean Text!" : "Copy Clean Text"}</span>
              </button>

              <Link
                href="/carousel"
                className="px-3 py-2 rounded-xl border border-white/10 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Open in Carousel Studio</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Educational Rules & Guide */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 space-y-3 backdrop-blur-xl">
            <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Why Algorithmic Authenticity Matters in 2026</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>The 3-Second Rule:</strong> Feeds heavily downrank posts starting with <em>"In today's fast-paced world"</em> or <em>"I'm thrilled to announce"</em> due to immediate scroll drop-offs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Concrete Metrics over Fluff:</strong> Replace vague phrases like <em>"move the needle"</em> with verifiable dollar impact or percentage improvements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Emoji Penalty:</strong> More than 3-4 emojis per post triggers spam classifiers and reduces mobile feed impressions.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
