"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Bot, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  Zap, 
  Layers, 
  GitFork, 
  Flame, 
  Terminal, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Workflow
} from "lucide-react";

interface TopicGeneratorProps {
  onGenerate: (
    topic: string, 
    toneGuidance?: string, 
    llmProvider?: string, 
    llmModel?: string, 
    temperature?: number,
    personaId?: string
  ) => void;
  isLoading: boolean;
}

const PERSONA_PRESETS = [
  { id: "contrarian_vc", name: "Contrarian VC", role: "GP @ Frontier Capital", badge: "Capital & Moats", desc: "Focuses on burn rates, unit economics, asymmetric leverage, and consensus traps." },
  { id: "systems_architect", name: "Systems Architect", role: "Principal Staff Engineer", badge: "Deterministic Code", desc: "Zero marketing fluff, deterministic execution, and state drift prevention." },
  { id: "hypergrowth_cmo", name: "Growth CMO", role: "B2B Marketing Leader", badge: "Pipeline & Dwell Time", desc: "Distribution flywheels, buyer intent psychology, and dark social loops." },
  { id: "bootstrapped_builder", name: "Bootstrapped Builder", role: "Solo Technical Founder", badge: "Radical Transparency", desc: "Real revenue metrics, customer-funded velocity, and zero VC buzzwords." },
];

interface TopicCategory {
  name: string;
  topics: string[];
}

const CATEGORIZED_TOPICS: TopicCategory[] = [
  {
    name: "AI & Agents",
    topics: [
      "Adversarial Multi-Agent State Drift in Production",
      "Why Most Enterprise DPO Pipelines Fail",
      "LLM Determinism vs Stochastic Reasoning in Autonomous Systems",
    ],
  },
  {
    name: "Cloud & Systems",
    topics: [
      "Zero-Day Threat Exploitation in Kubernetes Control Planes",
      "Event-Driven Microservices: When Kafka Becomes an Anti-Pattern",
      "Distributed Database Consensus Under High Write Saturation",
    ],
  },
  {
    name: "Growth & Ops",
    topics: [
      "The Death of Low-Effort B2B LinkedIn Thought Leadership",
      "Why Technical Foundational Content Beats Product Marketing Every Time",
      "The Cold-Start Trap in Reinforcement Learning from Human Feedback",
    ],
  },
];

const TONE_PRESETS = [
  { 
    id: "contrarian", 
    label: "Contrarian Hook", 
    desc: "Bold, anti-corporate, challenges consensus with strong conviction",
    badge: "High Viral Signal",
    icon: Flame,
    color: "from-amber-500/20 to-rose-500/20 text-rose-300 border-rose-500/30"
  },
  { 
    id: "blueprint", 
    label: "Architectural Blueprint", 
    desc: "Technical deep-dive, code/system architectures, zero marketing fluff",
    badge: "High Retain Rate",
    icon: Cpu,
    color: "from-cyan-500/20 to-indigo-500/20 text-cyan-300 border-cyan-500/30"
  },
  { 
    id: "executive", 
    label: "Executive Briefing", 
    desc: "C-suite strategic framing, ROI, risk mitigation, and leverage",
    badge: "B2B Decision Makers",
    icon: Zap,
    color: "from-purple-500/20 to-indigo-500/20 text-indigo-300 border-indigo-500/30"
  },
];

const LLM_PROVIDERS = [
  { id: "simulation", name: "Simulation Engine", desc: "Zero API keys needed, deterministic high-conviction debate", badge: "Instant & Free" },
  { id: "openai", name: "OpenAI GPT-4o", desc: "GPT-4o flagship model with deep systems knowledge", badge: "Live API" },
  { id: "anthropic", name: "Claude 3.5 Sonnet", desc: "Nuanced executive voice and anti-cringe prose", badge: "Live API" },
  { id: "gemini", name: "Gemini 1.5 Flash", desc: "Ultra-fast inference with sharp analytical clarity", badge: "Live API" },
  { id: "ollama", name: "Ollama (llama3.2)", desc: "100% private local inference on localhost:11434", badge: "Self-Hosted" },
];


export function TopicGenerator({ onGenerate, isLoading }: TopicGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("contrarian");
  const [selectedPersona, setSelectedPersona] = useState("contrarian_vc");
  const [selectedProvider, setSelectedProvider] = useState("simulation");
  const [temperature, setTemperature] = useState(0.7);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showGraphDetails, setShowGraphDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    const toneDesc = TONE_PRESETS.find((t) => t.id === selectedTone)?.desc;
    onGenerate(topic.trim(), toneDesc, selectedProvider, undefined, temperature, selectedPersona);
  };

  const handleSelectExample = (example: string) => {
    setTopic(example);
  };



  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-8">
      {/* Top Status & Architecture Badge */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono uppercase tracking-wider backdrop-blur-md shadow-glow">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>LangGraph Adversarial State Machine</span>
        </div>
        <button
          type="button"
          onClick={() => setShowGraphDetails(!showGraphDetails)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors cursor-pointer"
        >
          <Workflow className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showGraphDetails ? "Hide Pipeline Diagram" : "View Agent Graph Flow"}</span>
        </button>
      </div>

      {/* Main Hero Headline */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Autonomous B2B{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            RLHF Content Engine
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Synthesize high-conviction thought leadership through an adversarial loop between a{" "}
          <span className="text-indigo-300 font-medium">Domain SME Node</span> and an{" "}
          <span className="text-rose-400 font-medium">Algorithm Hacker</span>. Vote on the winning candidate to update DPO offline reward matrices.
        </p>
      </div>

      {/* Expandable Architecture Diagram */}
      {showGraphDetails && (
        <div className="glass-panel p-6 rounded-2xl text-left border-indigo-500/20 bg-slate-950/80 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">LangGraph Adversarial Synthesis Topology</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              State: Deterministic Graph
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">1</span>
                SME Writer Agent
              </div>
              <p className="text-xs text-slate-400">
                Researches domain architecture, extracts non-obvious engineering proofs, and guarantees technical accuracy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">2</span>
                Algorithm Hacker
              </div>
              <p className="text-xs text-slate-400">
                Audits dwell-time triggers, optimizes line breaks, and refactors opening hooks to maximize feed velocity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">3</span>
                RLHF & DPO Arena
              </div>
              <p className="text-xs text-slate-400">
                Human-in-the-loop side-by-side preference vote. Winner queues for LinkedIn dispatch; pair saves to SQLite DPO database.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Form Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative shadow-2xl shadow-indigo-950/40 text-left space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Input Field */}
          <div>
            <label htmlFor="topic-input" className="block text-xs font-mono uppercase text-slate-400 mb-2">
              1. Enter Topic or Technical Thesis
            </label>
            <div className="relative flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Zero-Day Exploits in Cloud Native DBs, or State Drift in Multi-Agent Workflows..."
                  disabled={isLoading}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-5 py-4 text-sm sm:text-base text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 transition-all font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={!topic.trim() || isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 px-8 py-4 font-semibold text-sm sm:text-base text-white shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex-shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Agents Debating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-cyan-200" />
                    <span>Generate A/B Candidates</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* LLM Inference Engine Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-mono uppercase text-slate-400">
                2. Live LLM Provider Engine
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Temperature:</span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">{temperature.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  disabled={isLoading}
                  className="w-20 sm:w-24 accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {LLM_PROVIDERS.map((p) => {
                const isSelected = selectedProvider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProvider(p.id)}
                    disabled={isLoading}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-950/30 shadow-glow"
                        : "border-white/[0.08] bg-slate-950/40 hover:border-white/20 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                    </div>
                    <span className={`text-[9px] font-mono px-1 py-0.5 rounded border w-fit mb-1.5 ${
                      isSelected ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300" : "border-slate-800 text-slate-500"
                    }`}>
                      {p.badge}
                    </span>
                    <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-2.5">
              3. Select Agent Tone Strategy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TONE_PRESETS.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    disabled={isLoading}
                    className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-950/30 shadow-glow"
                        : "border-white/[0.08] bg-slate-950/40 hover:border-white/20 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                        <span className="text-xs font-semibold text-white">{t.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${t.color}`}>
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona Selector */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="block text-xs font-mono uppercase text-slate-400">
                4. Executive Ghostwriter Persona
              </label>
              <span className="text-[11px] font-mono text-indigo-400">
                Custom Brand Voice Guardrails
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {PERSONA_PRESETS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPersona(p.id)}
                    disabled={isLoading}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-purple-500 bg-purple-950/30 shadow-glow"
                        : "border-white/[0.08] bg-slate-950/40 hover:border-white/20 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-white truncate">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 mb-1">{p.role}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-950/40 text-purple-300 w-fit mb-2">
                      {p.badge}
                    </span>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Prompts with Category Tabs */}
          <div className="pt-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono uppercase text-slate-400">
                5. Or Pick From Curated High-Conviction Prompts:
              </span>

              <div className="flex items-center gap-1">
                {CATEGORIZED_TOPICS.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveCategory(idx)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeCategory === idx
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIZED_TOPICS[activeCategory].topics.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(item)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-slate-950/60 px-3.5 py-2 text-xs text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-slate-900 transition-all cursor-pointer text-left"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Pulsing Adversarial Progress Skeleton */}
        {isLoading && (
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-left animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs sm:text-sm font-mono text-indigo-300">
                  LangGraph Adversarial State Machine Executing...
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400">Iterative Consensus Loop</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                  <span className="font-semibold">Candidate A: Contrarian Hook Engine</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                    Optimizing Tension
                  </span>
                </div>
                <div className="h-3 bg-indigo-500/20 rounded w-3/4 animate-pulse"></div>
                <div className="h-3 bg-indigo-500/10 rounded w-full animate-pulse delay-75"></div>
                <div className="h-3 bg-indigo-500/15 rounded w-5/6 animate-pulse delay-150"></div>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                  <span className="font-semibold">Candidate B: Technical Blueprint Engine</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                    Structuring Systems
                  </span>
                </div>
                <div className="h-3 bg-cyan-500/20 rounded w-4/5 animate-pulse"></div>
                <div className="h-3 bg-cyan-500/10 rounded w-full animate-pulse delay-75"></div>
                <div className="h-3 bg-cyan-500/15 rounded w-2/3 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
