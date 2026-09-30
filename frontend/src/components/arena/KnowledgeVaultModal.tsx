"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Database,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Search
} from "lucide-react";
import { getVaultDocuments, ingestVaultDocument, deleteVaultDocument, queryVaultRAG } from "@/lib/api";

interface KnowledgeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic?: string;
}

export function KnowledgeVaultModal({
  isOpen,
  onClose,
  currentTopic = ""
}: KnowledgeVaultModalProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"docs" | "ingest" | "rag">("docs");

  // Ingestion form state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDocType, setNewDocType] = useState("viral_post");
  const [newTags, setNewTags] = useState("architecture, leadership");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // RAG query state
  const [ragTopic, setRagTopic] = useState(currentTopic || "Microservices vs Modular Monolith");
  const [ragResults, setRagResults] = useState<any>(null);
  const [ragLoading, setRagLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadDocs();
    if (currentTopic) {
      setRagTopic(currentTopic);
    }
  }, [isOpen, currentTopic]);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const res = await getVaultDocuments();
      if (res?.documents) {
        setDocuments(res.documents);
      }
    } catch (e) {
      console.error("Failed to load vault documents", e);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);
    setSuccessMsg("");
    try {
      const tagsList = newTags.split(",").map((t) => t.trim()).filter(Boolean);
      await ingestVaultDocument(newTitle, newContent, newDocType, tagsList);
      setSuccessMsg("Document ingested & Style DNA vectors extracted successfully!");
      setNewTitle("");
      setNewContent("");
      await loadDocs();
      setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("docs");
      }, 1200);
    } catch (e) {
      console.error("Ingest failed", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVaultDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleTestRAG = async () => {
    if (!ragTopic.trim()) return;
    setRagLoading(true);
    try {
      const res = await queryVaultRAG(ragTopic);
      setRagResults(res?.data);
    } catch (e) {
      console.error("RAG query failed", e);
    } finally {
      setRagLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600/30 to-blue-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Knowledge Vault & Brand Voice DNA
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  RAG Ingestion
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Ground the Adversarial Graph on founder transcripts, past viral posts, and cadence vectors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab("docs")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "docs"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Vault Assets ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab("ingest")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "ingest"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Ingest Asset & Extract DNA
          </button>
          <button
            onClick={() => setActiveTab("rag")}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === "rag"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Test RAG Conditioning
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "docs" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-slate-400 text-sm">Loading Vault Documents...</div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  No brand documents ingested yet. Switch to &quot;Ingest Asset&quot; to seed your knowledge base.
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{doc.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {doc.doc_type}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {(doc.tags || []).map((t: string, idx: number) => (
                            <span key={idx} className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg font-mono border border-slate-800/80 leading-relaxed">
                      {doc.content.length > 250 ? `${doc.content.slice(0, 250)}...` : doc.content}
                    </p>

                    {doc.style_metrics && (
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Primary Tone</span>
                          <span className="text-cyan-400 font-medium">{doc.style_metrics.primary_tone}</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Avg Sentence Cadence</span>
                          <span className="text-emerald-400 font-medium">{doc.style_metrics.avg_sentence_len} words</span>
                        </div>
                        <div className="bg-slate-900/40 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Lexical Richness</span>
                          <span className="text-purple-400 font-medium">{doc.style_metrics.vocabulary_richness * 100}% unique</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "ingest" && (
            <form onSubmit={handleIngest} className="space-y-4">
              {successMsg && (
                <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  {successMsg}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 2024 Microservices Monolith Retro"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Type</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="viral_post">Top Viral Post</option>
                    <option value="podcast_transcript">Podcast / Video Transcript</option>
                    <option value="whitepaper">Internal Whitepaper / Strategy</option>
                    <option value="notes">Raw Founder Notes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Content / Transcript</label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste past high-performing thought leadership posts, raw talk transcripts, or technical post-mortems..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="cloud, pricing, kubernetes, engineering-culture"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4" />
                  {submitting ? "Analyzing & Vectorizing..." : "Ingest & Extract Voice DNA"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "rag" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ragTopic}
                  onChange={(e) => setRagTopic(e.target.value)}
                  placeholder="Enter a prospective post topic..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleTestRAG}
                  disabled={ragLoading}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition"
                >
                  <Search className="w-3.5 h-3.5" />
                  {ragLoading ? "Querying..." : "Simulate RAG Context"}
                </button>
              </div>

              {ragResults && (
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Matched Documents: <strong className="text-white">{ragResults.matched_count}</strong>
                    </span>
                    <span className="text-cyan-400 font-mono text-[11px]">
                      Target Tone: {ragResults.recommended_tone}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Injected Context Snippets:
                    </span>
                    {(ragResults.snippets || []).map((snip: string, i: number) => (
                      <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded text-xs text-slate-300 font-mono">
                        {snip}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
          <span>SynapseRL Semantic Brand Vector Store</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
