"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Copy, 
  Check, 
  Sparkles,
  Download,
  Palette
} from "lucide-react";
import { generateCarousel } from "@/lib/api";

interface CarouselGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  variantLabel: string;
  topic: string;
  content: string;
}

export function CarouselGeneratorModal({
  isOpen,
  onClose,
  variantLabel,
  topic,
  content,
}: CarouselGeneratorModalProps) {
  const [theme, setTheme] = useState<"stealth" | "indigo" | "emerald">("stealth");
  const [data, setData] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    generateCarousel(topic, content, theme).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [isOpen, topic, content, theme]);

  if (!isOpen) return null;

  const slides = data?.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0] || {};
  const totalSlides = slides.length || 6;

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handlePrintPdf = () => {
    if (!data?.printable_html) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(data.printable_html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleCopyMarkdownDeck = () => {
    if (!slides.length) return;
    const markdown = slides
      .map((s: any) => {
        let text = `## Slide ${s.slide_number}: [${s.badge}] ${s.title}\n`;
        if (s.subtitle) text += `*${s.subtitle}*\n\n`;
        if (s.content) text += `${s.content}\n\n`;
        if (s.items) text += s.items.map((it: string) => `- ${it}`).join("\n") + "\n\n";
        text += `> ${s.footer}\n---`;
        return text;
      })
      .join("\n\n");

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color theme maps for modal preview
  const themeStyles = {
    stealth: {
      card: "bg-slate-950 border-slate-800 text-slate-100",
      badge: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
      accent: "text-sky-400",
      glow: "from-sky-500/10 via-transparent to-transparent"
    },
    indigo: {
      card: "bg-[#0b0c1e] border-indigo-900/60 text-indigo-50",
      badge: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
      accent: "text-indigo-400",
      glow: "from-indigo-500/10 via-transparent to-transparent"
    },
    emerald: {
      card: "bg-[#071710] border-emerald-900/60 text-emerald-50",
      badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      accent: "text-emerald-400",
      glow: "from-emerald-500/10 via-transparent to-transparent"
    }
  };

  const activeStyle = themeStyles[theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl text-left space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  LinkedIn Document Carousel & Slide Deck
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono">
                  {variantLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transforms content into 4:5 swipeable PDF document cards driving 3–5x algorithmic dwell time.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Theme selector + Export actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">Palette:</span>
            <div className="flex items-center gap-1.5">
              {(["stealth", "indigo", "emerald"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                    theme === t
                      ? "bg-white text-slate-950 font-semibold shadow"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdownDeck}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Deck Copied!" : "Copy Deck Markdown"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF Carousel</span>
            </button>
          </div>
        </div>

        {/* Slide Preview Stage */}
        <div className="flex flex-col items-center">
          {/* Card Mockup (4:5 Aspect Ratio Container) */}
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl border p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br border-white/10" style={{
            backgroundColor: theme === "stealth" ? "#090d16" : theme === "indigo" ? "#0b0c1e" : "#071710",
            borderColor: theme === "stealth" ? "#1e293b" : theme === "indigo" ? "#2c2a63" : "#134e38"
          }}>
            {/* Top Bar */}
            <div className="flex items-center justify-between z-10">
              <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase ${activeStyle.badge}`}>
                {currentSlide.badge || "BRIEF"}
              </span>
              <span className="text-xs font-mono font-semibold text-slate-400">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>

            {/* Middle Content */}
            <div className="flex-1 flex flex-col justify-center py-6 space-y-4 z-10">
              <h4 className="text-2xl font-extrabold text-white leading-tight tracking-tight">
                {currentSlide.title}
              </h4>

              {currentSlide.subtitle && (
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {currentSlide.subtitle}
                </p>
              )}

              {currentSlide.content && (
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                  {currentSlide.content}
                </p>
              )}

              {currentSlide.items && (
                <ul className="space-y-2.5 pt-2">
                  {currentSlide.items.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200 leading-snug">
                      <span className={`font-bold mt-0.5 ${activeStyle.accent}`}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 z-10">
              <div className="flex items-center gap-1.5 font-bold tracking-wider text-xs text-white">
                <span>SYNAPSE</span>
                <span className={activeStyle.accent}>RL</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {currentSlide.footer || "Swipe ➔"}
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between w-full max-w-md mt-4 px-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                currentSlideIndex === 0
                  ? "opacity-40 cursor-not-allowed border-white/5 bg-slate-900 text-slate-500"
                  : "border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Slide dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlideIndex 
                      ? "bg-amber-400 w-6" 
                      : "bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentSlideIndex === totalSlides - 1}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                currentSlideIndex === totalSlides - 1
                  ? "opacity-40 cursor-not-allowed border-white/5 bg-slate-900 text-slate-500"
                  : "border-white/10 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
