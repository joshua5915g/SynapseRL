"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  Twitter,
  Linkedin,
  FileText,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  Hash,
  Send
} from "lucide-react";
import { formatMultiPlatform } from "@/lib/api";

const SAMPLE_POST = {
  topic: "Why Most Teams Migrate to Microservices Too Early",
  content: `Resume-driven development is a quiet killer of early-stage enterprise startups.

We wasted 4 months migrating to microservices before having 1,000 daily active users.

The Industry Trap:
Splitting databases before understanding domain boundaries leads to distributed transactions, eventual consistency nightmares, and 3x cloud bills.

Here is the 3-step audit we run:
1. Build a modular monolith with strict internal boundaries.
2. Optimize your in-process memory and query indices.
3. Extract microservices ONLY when deployment velocity or hardware constraints demand it.

What is your team's biggest state bottleneck right now?`
};

export default function RepurposePage() {
  const [topic, setTopic] = useState(SAMPLE_POST.topic);
  const [content, setContent] = useState(SAMPLE_POST.content);
  const [formattedData, setFormattedData] = useState<any>(null);
  const [activePlatform, setActivePlatform] = useState<"linkedin" | "twitter" | "substack">("twitter");
  const [isFormatting, setIsFormatting] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    handleFormat(SAMPLE_POST.topic, SAMPLE_POST.content);
  }, []);

  const handleFormat = async (t?: string, c?: string) => {
    const activeTopic = t || topic;
    const activeContent = c || content;
    if (!activeTopic.trim() || !activeContent.trim()) return;

    setIsFormatting(true);
    try {
      const data = await formatMultiPlatform(activeTopic, activeContent);
      setFormattedData(data);
    } catch (err) {
      console.error("Format error:", err);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(key);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const xTweets: string[] = formattedData?.x_thread || [];
  const linkedinText: string = formattedData?.linkedin || content;
  const substackMarkdown: string = formattedData?.substack_markdown || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500/20 via-blue-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400 shadow-glow-sky">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Multi-Platform Cross-Publishing Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-sky-500/10 border border-sky-500/30 text-sky-300">
                  Feature #7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                1-Click Content Cross-Pollination: Converts B2B thought-leadership into native LinkedIn feeds, 280-char X/Twitter threads, and Substack markdown articles.
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-300 text-xs font-mono">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Est. Read: {formattedData?.reading_time_minutes || 1.5} min</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Source Draft Input (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Source B2B Article / Post
            </span>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Topic / Title</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-sky-500/50 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Content Body</label>
              <textarea
                rows={9}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-sky-500/50 font-sans leading-relaxed resize-y"
              />
            </div>

            <button
              type="button"
              onClick={() => handleFormat()}
              disabled={isFormatting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-glow-sky disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isFormatting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>Re-format for 3 Platforms</span>
            </button>
          </div>
        </div>

        {/* Right Column: Platform Preview & Copy Hub (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-white/10">
            <button
              type="button"
              onClick={() => setActivePlatform("twitter")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activePlatform === "twitter"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>X Thread ({xTweets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform("linkedin")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activePlatform === "linkedin"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn Feed</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePlatform("substack")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activePlatform === "substack"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Substack Article</span>
            </button>
          </div>

          {/* Tab 1: X / Twitter Thread */}
          {activePlatform === "twitter" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5" />
                  <span>X / Twitter Thread ({xTweets.length} Tweets)</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(xTweets.join("\n\n---\n\n"), "thread")}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedType === "thread" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === "thread" ? "Thread Copied!" : "Copy Full Thread"}</span>
                </button>
              </div>

              {/* Tweets List */}
              <div className="space-y-3">
                {xTweets.map((tweet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-white/5 bg-slate-950 space-y-2 text-xs font-sans leading-relaxed text-slate-200"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span className="text-sky-400 font-bold">Tweet {idx + 1} / {xTweets.length}</span>
                      <div className="flex items-center gap-2">
                        <span className={tweet.length > 280 ? "text-rose-400" : "text-slate-400"}>
                          {tweet.length} / 280
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(tweet, `tweet-${idx}`)}
                          className="text-slate-400 hover:text-white cursor-pointer"
                          title="Copy this tweet"
                        >
                          {copiedType === `tweet-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <p className="whitespace-pre-line">{tweet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: LinkedIn Single Feed Post */}
          {activePlatform === "linkedin" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn Feed Post</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(linkedinText, "linkedin")}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedType === "linkedin" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === "linkedin" ? "Copied!" : "Copy Post"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                {linkedinText}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/5">
                <span>{linkedinText.length} characters</span>
                <Link
                  href="/carousel"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Convert to LinkedIn PDF Carousel</span>
                </Link>
              </div>
            </div>
          )}

          {/* Tab 3: Substack Longform Markdown */}
          {activePlatform === "substack" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Substack & Medium Markdown</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(substackMarkdown, "substack")}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {copiedType === "substack" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === "substack" ? "Markdown Copied!" : "Copy Markdown"}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line max-h-[380px] overflow-y-auto">
                {substackMarkdown}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
