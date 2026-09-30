"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Printer,
  Copy,
  Check,
  Sparkles,
  Palette,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Share2,
  Calendar,
  Grid3X3,
  Maximize2,
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { generateCarousel } from "@/lib/api";

type ThemeType = "stealth" | "indigo" | "emerald" | "light";

interface SlideData {
  slide_number: number;
  type: string;
  badge: string;
  title: string;
  subtitle?: string;
  content?: string;
  items?: string[];
  footer?: string;
}

const PRESET_TEMPLATES = [
  {
    label: "Adversarial AI Architecture",
    topic: "Adversarial Multi-Agent State Drift in Production",
    content: `Most engineering teams scaling multi-agent systems make a $200k mistake:

They treat LLMs like deterministic databases instead of stochastic reasoning engines.

90% of autonomous agent failures happen because one model is responsible for both generation AND validation.

The fix? An Adversarial Dual-Agent Architecture:
1. Agent 1 (The Executor): Drafts domain solutions with strict constraint boundaries.
2. Agent 2 (The Red Team): Validates edge cases and flags corporate fluff before state commits.
3. RLHF Calibration: Discrepancies route to a human A/B arena for DPO fine-tuning.

Bookmark this framework before your next architecture review.`
  },
  {
    label: "Microservices vs Monolith",
    topic: "Why Most Teams Migrate to Microservices Too Early",
    content: `Resume-driven development is costing B2B startups millions in unnecessary network boundaries.

The Industry Trap: Splitting databases before understanding domain boundaries leads to distributed transactions, eventual consistency nightmares, and 3x cloud bills.

The Core Playbook:
1. Build a modular monolith with strict internal boundaries.
2. Optimize your in-process memory and query indices.
3. Extract microservices ONLY when deployment velocity or hardware constraints demand it.`
  },
  {
    label: "DPO vs PPO in B2B LLMs",
    topic: "Why Direct Preference Optimization (DPO) Replaced PPO",
    content: `Reinforcement Learning from Human Feedback used to require training complex actor-critic reward models with unstable PPO loops.

In 2024+, DPO collapsed this into a single closed-form loss function.

Why B2B teams win with DPO:
1. No separate reward model training infrastructure.
2. Mathematically stable gradients with zero policy collapse.
3. Direct ingestion of pairwise preference choices from real users.`
  }
];

export default function CarouselStudioPage() {
  const [topic, setTopic] = useState("Adversarial Multi-Agent State Drift in Production");
  const [content, setContent] = useState(PRESET_TEMPLATES[0].content);
  const [theme, setTheme] = useState<ThemeType>("stealth");
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [printableHtml, setPrintableHtml] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [isEditingCurrentSlide, setIsEditingCurrentSlide] = useState(false);

  // Generate initial carousel on mount
  useEffect(() => {
    handleGenerateDeck();
  }, []);

  const handleGenerateDeck = async (overrideTopic?: string, overrideContent?: string) => {
    setIsGenerating(true);
    const activeTopic = overrideTopic || topic;
    const activeContent = overrideContent || content;

    try {
      const res = await generateCarousel(activeTopic, activeContent, theme === "light" ? "stealth" : theme);
      if (res && res.slides) {
        setSlides(res.slides);
        setPrintableHtml(res.printable_html || "");
        setCurrentSlideIndex(0);
      }
    } catch (err) {
      console.error("Error generating carousel:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setTopic(template.topic);
    setContent(template.content);
    handleGenerateDeck(template.topic, template.content);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0] || {
    slide_number: 1,
    type: "cover",
    badge: "BRIEF",
    title: "Loading Deck...",
    subtitle: "",
    content: "",
    footer: "Swipe ➔"
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleUpdateCurrentSlide = (field: keyof SlideData, val: any) => {
    const updated = [...slides];
    updated[currentSlideIndex] = {
      ...updated[currentSlideIndex],
      [field]: val
    };
    setSlides(updated);
  };

  const handleAddSlide = () => {
    const newSlideNum = slides.length + 1;
    const newSlide: SlideData = {
      slide_number: newSlideNum,
      type: "custom",
      badge: "KEY TAKEAWAY",
      title: `Tactical Principle #${newSlideNum}`,
      content: "Add your high-signal insight or breakdown here.",
      footer: "Swipe to next slide ➔"
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDeleteCurrentSlide = () => {
    if (slides.length <= 2) return;
    const updated = slides.filter((_, idx) => idx !== currentSlideIndex).map((s, i) => ({
      ...s,
      slide_number: i + 1
    }));
    setSlides(updated);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const handlePrintPdf = () => {
    if (!printableHtml && !slides.length) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // If we have backend printableHtml, we can use it, or generate dynamic HTML from current state
      const t = themeConfigs[theme];
      const slidesMarkup = slides.map(s => {
        const items = s.items ? `<ul style="margin-top:24px;padding-left:20px;line-height:1.8;">` + s.items.map(it => `<li style="margin-bottom:12px;font-size:20px;color:${t.text};"><strong>✓</strong> ${it}</li>`).join("") + `</ul>` : "";
        const subtitle = s.subtitle ? `<p style="font-size:22px;line-height:1.5;color:${t.subtext};margin-top:16px;">${s.subtitle}</p>` : "";
        const bodyContent = s.content ? `<p style="font-size:22px;line-height:1.6;color:${t.text};margin-top:24px;white-space:pre-line;">${s.content}</p>` : "";
        return `
        <div class="slide" style="width:1080px;height:1350px;page-break-after:always;display:flex;align-items:center;justify-content:center;padding:80px;background:${t.bg};color:${t.text};">
          <div style="width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;border:2px solid ${t.border};border-radius:36px;padding:70px;background:${t.cardBg};box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="background:${t.badgeBg};color:${t.badgeColor};font-size:14px;font-weight:800;letter-spacing:2px;padding:8px 18px;border-radius:9999px;text-transform:uppercase;">${s.badge}</span>
              <span style="font-size:16px;font-weight:700;color:${t.subtext};font-family:monospace;">${s.slide_number} / ${slides.length}</span>
            </div>
            <div style="flex-grow:1;display:flex;flex-direction:column;justify-content:center;padding:40px 0;">
              <h2 style="font-size:44px;font-weight:800;line-height:1.25;letter-spacing:-0.02em;color:${t.text};">${s.title}</h2>
              ${subtitle}
              ${bodyContent}
              ${items}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${t.border};padding-top:28px;">
              <span style="font-size:20px;font-weight:900;letter-spacing:1px;">SYNAPSE<span style="color:${t.primary};">RL</span></span>
              <span style="font-size:16px;color:${t.subtext};font-weight:500;">${s.footer || "Swipe ➔"}</span>
            </div>
          </div>
        </div>`;
      }).join("\n");

      const doc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${topic} - LinkedIn Carousel Deck</title>
  <style>
    @page { size: 1080px 1350px; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body>
  ${slidesMarkup}
</body>
</html>`;

      printWindow.document.write(doc);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleCopyMarkdown = () => {
    if (!slides.length) return;
    const md = slides.map(s => {
      let t = `### Slide ${s.slide_number} [${s.badge}]: ${s.title}\n`;
      if (s.subtitle) t += `*${s.subtitle}*\n\n`;
      if (s.content) t += `${s.content}\n\n`;
      if (s.items) t += s.items.map(it => `- ${it}`).join("\n") + "\n\n";
      t += `> Footer: ${s.footer || "Swipe ➔"}\n---`;
      return t;
    }).join("\n\n");

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // Theme palettes configuration
  const themeConfigs = {
    stealth: {
      label: "Stealth Cyber",
      bg: "#090d16",
      cardBg: "#0f172a",
      border: "#1e293b",
      primary: "#38bdf8",
      subtext: "#94a3b8",
      text: "#f8fafc",
      badgeBg: "#0284c7",
      badgeColor: "#ffffff",
      previewContainer: "bg-slate-950 border-slate-800 text-slate-100",
      accentBadge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
      accentText: "text-sky-400"
    },
    indigo: {
      label: "Royal Indigo",
      bg: "#08091a",
      cardBg: "#0f102e",
      border: "#252453",
      primary: "#818cf8",
      subtext: "#a5b4fc",
      text: "#f5f3ff",
      badgeBg: "#4f46e5",
      badgeColor: "#ffffff",
      previewContainer: "bg-[#0b0c1e] border-indigo-900/60 text-indigo-50",
      accentBadge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      accentText: "text-indigo-400"
    },
    emerald: {
      label: "Emerald Matrix",
      bg: "#05120c",
      cardBg: "#0a2217",
      border: "#124933",
      primary: "#34d399",
      subtext: "#86efac",
      text: "#f0fdf4",
      badgeBg: "#059669",
      badgeColor: "#ffffff",
      previewContainer: "bg-[#071710] border-emerald-900/60 text-emerald-50",
      accentBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      accentText: "text-emerald-400"
    },
    light: {
      label: "Notion Minimalist",
      bg: "#f8fafc",
      cardBg: "#ffffff",
      border: "#e2e8f0",
      primary: "#0284c7",
      subtext: "#64748b",
      text: "#0f172a",
      badgeBg: "#0f172a",
      badgeColor: "#ffffff",
      previewContainer: "bg-white border-slate-200 text-slate-900",
      accentBadge: "bg-slate-900 text-white border-slate-900",
      accentText: "text-sky-600"
    }
  };

  const currentTheme = themeConfigs[theme];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 shadow-glow-amber">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  LinkedIn Document Carousel Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Feature #1
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Transforms B2B thoughts into high-dwell 4:5 vertical slide decks optimized for LinkedIn PDF uploads (3x–5x algorithmic reach).
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsGridView(!isGridView)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isGridView
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>{isGridView ? "Deck Preview" : "Grid View"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-mono transition-all cursor-pointer"
          >
            {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMarkdown ? "Copied MD!" : "Copy Markdown"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold font-mono shadow-glow-amber transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Export 1080x1350 PDF</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Controls & Slide Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Presets */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>High-Conviction Presets</span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-800/60 hover:border-amber-500/30 text-xs font-medium text-slate-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">{tmpl.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Generator Inputs */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Topic & Core Content
            </h3>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Topic / Headline</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Distributed Consensus in Mission-Critical Systems"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50 transition-colors font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Article / Post Body</label>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full article or key takeaway bullets here..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors font-sans resize-y leading-relaxed"
              />
            </div>

            {/* Theme Selector */}
            <div className="space-y-2 pt-1">
              <label className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                <span>Visual Palette</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["stealth", "indigo", "emerald", "light"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`px-3 py-2 rounded-xl border text-xs font-mono capitalize transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      theme === t
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-sm"
                        : "bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{
                      backgroundColor: themeConfigs[t].primary
                    }} />
                    <span>{themeConfigs[t].label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleGenerateDeck()}
              disabled={isGenerating}
              className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-mono text-xs font-bold transition-all shadow-glow-amber disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Carousel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Deconstruct Into Slides</span>
                </>
              )}
            </button>
          </div>

          {/* Slide Editor Panel */}
          {slides.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Slide {currentSlideIndex + 1} of {slides.length}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleAddSlide}
                    title="Add new slide"
                    className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteCurrentSlide}
                    title="Delete current slide"
                    disabled={slides.length <= 2}
                    className="p-1.5 rounded-lg border border-white/5 bg-slate-950 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={currentSlide.badge || ""}
                    onChange={(e) => handleUpdateCurrentSlide("badge", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Slide Title / Main Hook</label>
                  <input
                    type="text"
                    value={currentSlide.title || ""}
                    onChange={(e) => handleUpdateCurrentSlide("title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {currentSlide.subtitle !== undefined && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={currentSlide.subtitle || ""}
                      onChange={(e) => handleUpdateCurrentSlide("subtitle", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                )}

                {currentSlide.content !== undefined && (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Slide Content</label>
                    <textarea
                      rows={3}
                      value={currentSlide.content || ""}
                      onChange={(e) => handleUpdateCurrentSlide("content", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-y"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Slide Footer Text</label>
                  <input
                    type="text"
                    value={currentSlide.footer || ""}
                    onChange={(e) => handleUpdateCurrentSlide("footer", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-slate-400 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live 4:5 Slide Deck Preview Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {!isGridView ? (
            /* Single Slide Focus Mode */
            <div className="w-full flex flex-col items-center space-y-4">
              {/* Slide Mockup (4:5 Ratio Container) */}
              <div
                className={`relative w-full max-w-md aspect-[4/5] rounded-3xl border p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 overflow-hidden ${currentTheme.previewContainer}`}
                style={{
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.border
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between z-10">
                  <span
                    className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase ${currentTheme.accentBadge}`}
                  >
                    {currentSlide.badge || "BRIEF"}
                  </span>
                  <span className="text-xs font-mono font-bold opacity-75" style={{ color: currentTheme.subtext }}>
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-center py-6 space-y-4 z-10">
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight"
                    style={{ color: currentTheme.text }}
                  >
                    {currentSlide.title}
                  </h3>

                  {currentSlide.subtitle && (
                    <p className="text-sm font-medium leading-relaxed" style={{ color: currentTheme.subtext }}>
                      {currentSlide.subtitle}
                    </p>
                  )}

                  {currentSlide.content && (
                    <p
                      className="text-sm sm:text-base leading-relaxed whitespace-pre-line"
                      style={{ color: currentTheme.text }}
                    >
                      {currentSlide.content}
                    </p>
                  )}

                  {currentSlide.items && (
                    <ul className="space-y-2.5 pt-2">
                      {currentSlide.items.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-snug">
                          <span className={`font-bold mt-0.5 ${currentTheme.accentText}`}>✓</span>
                          <span style={{ color: currentTheme.text }}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t pt-4 z-10" style={{ borderColor: currentTheme.border }}>
                  <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs">
                    <span style={{ color: currentTheme.text }}>SYNAPSE</span>
                    <span className={currentTheme.accentText}>RL</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: currentTheme.subtext }}>
                    {currentSlide.footer || "Swipe ➔"}
                  </span>
                </div>
              </div>

              {/* Slider Navigation Bar */}
              <div className="flex items-center justify-between w-full max-w-md px-2 py-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentSlideIndex === 0}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                    currentSlideIndex === 0
                      ? "opacity-30 cursor-not-allowed border-white/5 bg-slate-900 text-slate-600"
                      : "border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Slide indicator dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlideIndex
                          ? "bg-amber-400 w-6"
                          : "bg-slate-700 hover:bg-slate-500 w-2"
                      }`}
                      aria-label={`Jump to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentSlideIndex === slides.length - 1}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                    currentSlideIndex === slides.length - 1
                      ? "opacity-30 cursor-not-allowed border-white/5 bg-slate-900 text-slate-600"
                      : "border-white/10 bg-slate-900 text-slate-200 hover:bg-slate-800 cursor-pointer"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Grid Overview Mode */
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setIsGridView(false);
                  }}
                  className={`aspect-[4/5] rounded-2xl border p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    idx === currentSlideIndex ? "ring-2 ring-amber-400" : ""
                  }`}
                  style={{
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.border
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${currentTheme.accentBadge}`}>
                      {s.badge}
                    </span>
                    <span className="text-[10px] font-mono opacity-60" style={{ color: currentTheme.subtext }}>
                      {idx + 1}
                    </span>
                  </div>
                  <div className="py-2">
                    <h5 className="text-xs font-bold leading-tight line-clamp-3" style={{ color: currentTheme.text }}>
                      {s.title}
                    </h5>
                  </div>
                  <div className="text-[8px] text-right font-mono opacity-50" style={{ color: currentTheme.subtext }}>
                    {s.footer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Banner */}
          <div className="w-full max-w-md mt-6 rounded-2xl border border-white/5 bg-slate-900/40 p-3.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500">Dimensions:</span> <span className="text-white">1080x1350 (4:5)</span>
            </div>
            <div>
              <span className="text-slate-500">Total Cards:</span> <span className="text-amber-400 font-bold">{slides.length}</span>
            </div>
            <div>
              <span className="text-slate-500">Format:</span> <span className="text-emerald-400">LinkedIn PDF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
