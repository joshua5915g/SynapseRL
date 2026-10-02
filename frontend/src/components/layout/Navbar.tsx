"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Activity,
  Cpu,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Layers,
  ShieldAlert,
  Zap,
  Calendar,
  FolderArchive,
  Scale,
  Share2,
  Users,
  TrendingUp,
  Database,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Primary hubs shown directly in the pill capsule
  const primaryLinks = [
    { href: "/", label: "Mission Control", icon: Activity },
    { href: "/arena", label: "RLHF Arena", icon: Flame, badge: "Live" },
    { href: "/carousel", label: "Carousel", icon: Layers, badge: "Studio" },
    { href: "/hooks", label: "Hook Lab", icon: Zap },
    { href: "/velocity", label: "Velocity", icon: TrendingUp },
  ];

  // Secondary engines inside the Studio dropdown
  const studioLinks = [
    { href: "/repurpose", label: "Repurpose Studio", icon: Share2, desc: "Cross-platform viral threads" },
    { href: "/personas", label: "Voice Studio", icon: Users, desc: "Executive ghostwriter profiles", badge: "Voice" },
    { href: "/linter", label: "Cringe Linter", icon: ShieldAlert, desc: "B2B cliché & corporate buzzword detector" },
    { href: "/synthetic", label: "AI Judge", icon: Scale, desc: "Autonomous LLM-as-a-judge & DPO annotator" },
    { href: "/training", label: "DPO Hub", icon: Database, desc: "HuggingFace TRL fine-tuning pipeline", badge: "TRL" },
    { href: "/schedule", label: "Smart Scheduler", icon: Calendar, desc: "Gaussian jitter dispatch queue" },
    { href: "/vault", label: "Knowledge Vault", icon: FolderArchive, desc: "Vector context & reference embeddings" },
    { href: "/telemetry", label: "Engine Telemetry", icon: Cpu, desc: "Reward convergence & token velocity" },
  ];

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStudioOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setStudioOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isStudioActive = studioLinks.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 w-full pt-3 pb-3 px-4 sm:px-6 bg-[#120400]/80 backdrop-blur-xl border-b border-orange-950/50 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo - Hard Left */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff3d00] via-[#ff6a00] to-[#ffb27a] p-[1.5px] shadow-glow group-hover:shadow-[#ff3d00]/60 transition-all duration-300">
            <div className="w-full h-full bg-[#1a0803] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#ff8a1f] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-mono">
                Synapse<span className="text-[#ff5722] font-extrabold">RL</span>
              </span>
              <span className="px-1.5 py-0.2 text-[9px] font-mono rounded-md bg-orange-500/20 text-[#ff8a1f] border border-orange-500/30 font-semibold uppercase tracking-wider">
                Forge
              </span>
            </div>
          </div>
        </Link>

        {/* Centered Frosted Capsule Pill Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1 nav-capsule-glass rounded-full p-1.5"
          aria-label="Primary Navigation"
        >
          {primaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.12] text-white shadow-sm shadow-black/40 border border-white/10"
                    : "text-orange-200/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff8a1f]" : "text-orange-300/50"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-orange-500/20 text-[#ff8a1f] border border-orange-500/30 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Studio Dropdown Chip */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setStudioOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isStudioActive || studioOpen
                  ? "bg-orange-500/25 text-[#ff8a1f] border border-orange-500/30"
                  : "text-orange-200/60 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span>Engines</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${studioOpen ? "rotate-180" : ""}`}
              />
            </button>

            {studioOpen && (
              <div className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 rounded-2xl nav-capsule-glass border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-orange-300/60 border-b border-white/[0.06] mb-1">
                  Engine Modules & Sub-agents
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {studioLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setStudioOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                          isActive
                            ? "bg-orange-500/20 text-white border border-orange-500/30"
                            : "hover:bg-white/[0.06] text-orange-100/80"
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.06]">
                          <Icon className="w-3.5 h-3.5 text-[#ff8a1f]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-orange-50">{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-orange-500/20 text-[#ff8a1f]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-orange-200/50 line-clamp-1">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Area - Hard Right */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/40 border border-orange-500/30 text-[#ff8a1f] text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3d00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3d00]"></span>
            </span>
            <span>Forge Graph Active</span>
          </div>

          <Link
            href="/arena"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff3d00] via-[#ea3800] to-[#ff8a1f] hover:from-[#ff5722] hover:to-[#ffa726] text-white shadow-pill-glow transition-all active:scale-[0.98] border border-white/10"
          >
            <span>Review Queue</span>
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowRight className="w-2.5 h-2.5 text-white" />
            </span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-orange-200/70 hover:text-white hover:bg-orange-950 border border-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation sheet */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 rounded-2xl nav-capsule-glass border border-white/10 p-4 shadow-2xl animate-in slide-in-from-top-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
            Primary Navigation
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            {primaryLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${
                    isActive
                      ? "bg-indigo-500/20 text-white border border-indigo-500/30"
                      : "text-slate-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 border-t border-white/[0.06] pt-3">
            Engines & Sub-Agents
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {studioLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    isActive
                      ? "bg-indigo-500/20 text-white border border-indigo-500/30"
                      : "text-slate-300 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
