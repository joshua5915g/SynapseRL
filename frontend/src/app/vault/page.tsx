"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderArchive,
  Sparkles,
  Search,
  Plus,
  Trash2,
  BookOpen,
  Tag,
  Sliders,
  CheckCircle,
  RefreshCw,
  FileText,
  Mic,
  Bookmark,
  Layers,
  Zap,
  ArrowRight
} from "lucide-react";
import { getVaultDocuments, ingestVaultDocument, deleteVaultDocument, queryVaultRAG } from "@/lib/api";

const PRESET_DOCUMENTS = [
  {
    title: "Why Most Engineering Leaders Over-Architect Too Early",
    content: "Resume-driven development is a quiet killer of early-stage enterprise startups. We wasted 4 months migrating to microservices before having 1,000 daily active users. Rule: Start with a modular monolith with strict internal boundaries. Optimize query indices before adding network serialization hops.",
    doc_type: "viral_post",
    tags: ["architecture", "scaling", "leadership"]
  },
  {
    title: "Zero-Trust Agentic Sandboxing Manifesto",
    content: "Treating LLMs as trusted deterministic logic components is the #1 vulnerability in AI-enabled enterprise apps. We enforce strict JSON schema validation, dual-agent adversarial critique passes, and human-in-the-loop review for state-altering transactions.",
    doc_type: "whitepaper",
    tags: ["ai-agents", "security", "dpo"]
  }
];

export default function VaultPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isIngesting, setIsIngesting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDocType, setNewDocType] = useState("viral_post");
  const [newTags, setNewTags] = useState("architecture, leadership");

  // RAG Simulator State
  const [ragQuery, setRagQuery] = useState("Distributed Agent Consensus");
  const [ragResult, setRagResult] = useState<any>(null);
  const [isQueryingRAG, setIsQueryingRAG] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const res = await getVaultDocuments();
      setDocuments(res.documents || []);
    } catch (err) {
      console.error("Failed to load vault documents:", err);
    }
  };

  const handleIngest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsIngesting(true);
    setSuccessMessage(null);
    try {
      const tagList = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await ingestVaultDocument(newTitle, newContent, newDocType, tagList);
      if (res?.document) {
        setDocuments((prev) => [res.document, ...prev]);
        setSuccessMessage(`Document "${newTitle}" indexed! Linguistic style DNA extracted.`);
        setNewTitle("");
        setNewContent("");
      }
    } catch (err) {
      console.error("Ingest error:", err);
    } finally {
      setIsIngesting(false);
    }
  };

  const handleQuickLoadPreset = (preset: typeof PRESET_DOCUMENTS[0]) => {
    setNewTitle(preset.title);
    setNewContent(preset.content);
    setNewDocType(preset.doc_type);
    setNewTags(preset.tags.join(", "));
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteVaultDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleRunRAGSimulation = async () => {
    if (!ragQuery.trim()) return;
    setIsQueryingRAG(true);
    try {
      const res = await queryVaultRAG(ragQuery);
      setRagResult(res?.data || null);
    } catch (err) {
      console.error("RAG query error:", err);
    } finally {
      setIsQueryingRAG(false);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || doc.doc_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 shadow-glow-purple">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Enterprise Knowledge Vault & Voice DNA
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Feature #5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Linguistic style index: Ingest past viral articles, podcast transcripts, and whitepapers to extract your executive writing DNA and ground AI generations.
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>{documents.length} Assets Ingested</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/40 p-4 backdrop-blur-xl flex items-center justify-between gap-4 text-xs font-mono text-purple-200 shadow-glow-purple">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-purple-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Ingest Form vs Document Asset Library (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Asset Ingestion Studio (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>Ingest Brand Asset & Extract DNA</span>
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-mono">Load Sample:</span>
              {PRESET_DOCUMENTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickLoadPreset(p)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-950 border border-white/5 text-slate-300 hover:text-white hover:border-purple-500/30 transition-all cursor-pointer"
                >
                  {p.title.split(" ")[0]}...
                </button>
              ))}
            </div>

            <form onSubmit={handleIngest} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Scaling Monolith to Microservices Retro"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Asset Type</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 cursor-pointer"
                  >
                    <option value="viral_post">Past Viral Post</option>
                    <option value="whitepaper">Technical Whitepaper</option>
                    <option value="podcast_transcript">Podcast Transcript</option>
                    <option value="notes">Executive Notes</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="architecture, cloud"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Content / Transcript Body</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste your past high-performing writing, interview transcript, or technical post-mortem..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 transition-colors font-sans resize-y leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isIngesting || !newTitle.trim() || !newContent.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 hover:from-purple-400 hover:to-indigo-400 text-white font-mono text-xs font-bold transition-all shadow-glow-purple disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isIngesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Ingest & Extract Style DNA</span>
              </button>
            </form>
          </div>

          {/* RAG Context Query Simulator */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3.5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>RAG Voice Calibration Simulator</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Test how the adversarial multi-agent graph retrieves your brand tone and relevant context snippets for any prompt topic.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Topic for RAG context..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50 font-sans"
              />
              <button
                type="button"
                onClick={handleRunRAGSimulation}
                disabled={isQueryingRAG}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
              >
                {isQueryingRAG ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Query</span>}
              </button>
            </div>

            {ragResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs font-sans">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400">Recommended Tone:</span>
                  <span className="text-indigo-300 font-bold">{ragResult.recommended_tone}</span>
                </div>
                <div className="text-slate-300 italic bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                  "{ragResult.snippets?.[0] || "No exact snippet matched; default executive voice applied."}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ingested Asset Library (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents or tags..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              {(["all", "viral_post", "whitepaper"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                    selectedType === t
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : "bg-slate-900/60 border border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {t === "all" ? "All Types" : t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards */}
          <div className="space-y-3.5">
            {filteredDocs.map((doc: any, idx: number) => {
              const metrics = doc.style_metrics || {
                avg_sentence_len: 17.5,
                vocabulary_richness: 0.82,
                primary_tone: "Pragmatic Visionary"
              };

              return (
                <div
                  key={doc.id || idx}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 backdrop-blur-xl hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          {doc.doc_type?.replace("_", " ") || "NOTE"}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">
                          Tone: {metrics.primary_tone}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-sans leading-snug">
                        {doc.title}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                    {doc.content}
                  </p>

                  {/* Extracted Linguistic Style DNA Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Avg Length: <strong className="text-slate-200">{metrics.avg_sentence_len}w</strong></span>
                      <span>Vocab: <strong className="text-slate-200">{Math.round((metrics.vocabulary_richness || 0.8) * 100)}%</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {doc.tags?.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-900/40 text-center space-y-2">
                <FolderArchive className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400 font-mono">No documents found matching filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
