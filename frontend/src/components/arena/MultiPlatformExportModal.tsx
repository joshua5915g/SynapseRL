"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Twitter, 
  FileText, 
  Linkedin, 
  ExternalLink,
  Sparkles,
  BookOpen
} from "lucide-react";
import { formatMultiPlatform } from "@/lib/api";

interface MultiPlatformExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantLabel: string;
  topic: string;
  content: string;
}

export function MultiPlatformExportModal({
  isOpen,
  onClose,
  variantLabel,
  topic,
  content,
}: MultiPlatformExportModalProps) {
  const [activeTab, setActiveTab] = useState<"x_thread" | "substack" | "linkedin">("x_thread");
  const [data, setData] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    formatMultiPlatform(topic, content).then(setData);
  }, [isOpen, topic, content]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const xThread: string[] = data?.x_thread || [];
  const substackDoc: string = data?.substack_markdown || content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Cross-Platform Formatter</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/30 bg-purple-950/40 text-purple-300">
                  {variantLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                1-click repurpose winning thought leadership across X (Twitter) Threads and Substack essays.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("x_thread")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "x_thread"
                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>𝕏 Thread ({xThread.length} tweets)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("substack")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "substack"
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Substack / Medium Essay</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("linkedin")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              activeTab === "linkedin"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn Post</span>
          </button>
        </div>

        {/* TAB 1: X (Twitter) Thread */}
        {activeTab === "x_thread" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Auto-split into {xThread.length} sequential tweets (≤ 280 chars each)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(xThread.join("\n\n---\n\n"), "all_tweets")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono transition-all cursor-pointer"
              >
                {copiedKey === "all_tweets" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Entire Thread</span>
              </button>
            </div>

            <div className="space-y-3">
              {xThread.map((tweet, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl border border-white/[0.08] bg-slate-900/50 space-y-2 group hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="text-cyan-400 font-bold">Tweet {i + 1} of {xThread.length}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tweet, `tweet_${i}`)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedKey === `tweet_${i}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-sans whitespace-pre-line leading-relaxed">
                    {tweet}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Substack / Medium */}
        {activeTab === "substack" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                Expanded Markdown Essay (~{data?.reading_time_minutes || 2} min read)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(substackDoc, "substack")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 text-xs font-mono transition-all cursor-pointer"
              >
                {copiedKey === "substack" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Markdown Essay</span>
              </button>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-slate-900/50 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {substackDoc}
            </div>
          </div>
        )}

        {/* TAB 3: LinkedIn */}
        {activeTab === "linkedin" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                LinkedIn Formatted Post ({data?.word_count || 0} words)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(content, "linkedin_copy")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-mono transition-all cursor-pointer"
              >
                {copiedKey === "linkedin_copy" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy LinkedIn Text</span>
              </button>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-slate-900/50 font-sans text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {content}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
