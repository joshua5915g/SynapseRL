"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  CheckCircle,
  Plus,
  ShieldAlert,
  Sliders,
  Check,
  Briefcase,
  Quote,
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { fetchPersonas } from "@/lib/api";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function PersonasPage() {
  const [personas, setPersonas] = useState<any[]>([]);
  const [activePersonaId, setActivePersonaId] = useState<string>("contrarian_vc");
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [bio, setBio] = useState("");
  const [toneCharacteristics, setToneCharacteristics] = useState("Provocative, High-conviction, Analytical");
  const [preferredKeywords, setPreferredKeywords] = useState("Unit economics, Asymmetric upside, Moats");
  const [forbiddenWords, setForbiddenWords] = useState("In today's fast-paced world, Game-changer, Delve");
  const [signatureCta, setSignatureCta] = useState("What is your team's highest-conviction bet this quarter?");

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const data = await fetchPersonas();
      if (data && data.length > 0) {
        setPersonas(data);
      }
    } catch (err) {
      console.error("Failed to load personas:", err);
    }
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roleTitle.trim()) return;

    const payload = {
      name,
      role_title: roleTitle,
      bio,
      tone_characteristics: toneCharacteristics.split(",").map((s) => s.trim()).filter(Boolean),
      preferred_keywords: preferredKeywords.split(",").map((s) => s.trim()).filter(Boolean),
      forbidden_words: forbiddenWords.split(",").map((s) => s.trim()).filter(Boolean),
      signature_cta: signatureCta,
      hook_archetype: "Contrarian Industry Debunk",
    };

    try {
      const res = await fetch(`${BACKEND_BASE}/api/v1/personas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newPersona = await res.json();
        setPersonas((prev) => [...prev, newPersona]);
        setActivePersonaId(newPersona.id);
        setSuccessMessage(`Custom persona "${name}" calibrated and activated!`);
        setIsCreating(false);
        setName("");
        setRoleTitle("");
        setBio("");
      }
    } catch (err) {
      console.error("Failed to create persona:", err);
    }
  };

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 text-amber-400 shadow-glow-amber">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Executive Ghostwriter Persona Studio
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Feature #8
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Calibrate custom writing identities: Define tone vectors, preferred executive vocabulary, banned corporate buzzwords, and signature CTAs.
              </p>
            </div>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-mono text-xs font-bold transition-all shadow-glow-amber cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? "Close Form" : "Create Custom Persona"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-4 backdrop-blur-xl flex items-center justify-between gap-4 text-xs font-mono text-amber-200 shadow-glow-amber">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-amber-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Custom Persona Creator Slide-down */}
      {isCreating && (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-6 backdrop-blur-xl space-y-4 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calibrate New Executive Ghostwriter Persona</span>
            </h3>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Executive Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Chief Data Architect"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Role / Title Headline</label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. VP of Data Engineering @ FinTech Scaleup"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Bio & Core Writing Philosophy</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="High-conviction perspective on distributed architecture, cloud costs, and data pipelines..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Tone Attributes</label>
                <input
                  type="text"
                  value={toneCharacteristics}
                  onChange={(e) => setToneCharacteristics(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Preferred Keywords</label>
                <input
                  type="text"
                  value={preferredKeywords}
                  onChange={(e) => setPreferredKeywords(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Forbidden Words / Clichés</label>
                <input
                  type="text"
                  value={forbiddenWords}
                  onChange={(e) => setForbiddenWords(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Signature CTA</label>
              <input
                type="text"
                value={signatureCta}
                onChange={(e) => setSignatureCta(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shadow-glow-amber cursor-pointer"
              >
                Save & Activate Persona
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Personas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((p) => {
          const isSelected = p.id === activePersonaId;
          return (
            <div
              key={p.id}
              onClick={() => setActivePersonaId(p.id)}
              className={`rounded-2xl border p-6 backdrop-blur-xl transition-all duration-200 cursor-pointer space-y-4 relative ${
                isSelected
                  ? "bg-slate-900 border-amber-500/50 shadow-glow-amber ring-1 ring-amber-500/30"
                  : "bg-slate-900/60 border-white/10 hover:border-white/20"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                  <Check className="w-3 h-3" />
                  <span>ACTIVE VOICE</span>
                </div>
              )}

              {/* Title & Bio */}
              <div className="space-y-1 pr-24">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{p.name}</span>
                  {p.is_custom && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-amber-300 font-sans">{p.role_title}</p>
                <p className="text-xs text-slate-400 font-sans pt-1 leading-relaxed">{p.bio}</p>
              </div>

              {/* Tone Attributes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Tone Vectors
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.tone_characteristics?.map((tone: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 border border-white/5 text-[11px] font-mono text-slate-300"
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred vs Banned */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <span className="text-emerald-400 font-semibold block text-[10px] uppercase">
                    Key Vocabulary
                  </span>
                  <p className="text-slate-300 leading-snug line-clamp-2">
                    {p.preferred_keywords?.slice(0, 4).join(", ")}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <span className="text-rose-400 font-semibold block text-[10px] uppercase">
                    Forbidden Tropes
                  </span>
                  <p className="text-slate-400 leading-snug line-clamp-2">
                    {p.forbidden_words?.slice(0, 3).join(", ")}
                  </p>
                </div>
              </div>

              {/* Signature CTA */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Quote className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate italic">"{p.signature_cta}"</span>
                </div>
                <Link
                  href="/"
                  className="text-amber-400 hover:text-amber-300 font-mono text-xs flex items-center gap-1 flex-shrink-0 ml-2"
                >
                  <span>Use in Prompt</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
