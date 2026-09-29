"use client";

import React, { useState } from "react";
import { Download, Database, Check, Copy, Code, Terminal, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportDPODataset } from "@/lib/api";

export function DPOExportCard() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const TRL_SNIPPET = `from trl import DPOTrainer, DPOConfig
trainer = DPOTrainer(
    model="meta-llama/Llama-3-8B-Instruct",
    train_dataset="synapse_rlhf_dpo.json",
    beta=0.1
)`;

  const handleExport = async () => {
    try {
      setDownloading(true);
      const res = await exportDPODataset();
      
      const blob = new Blob([JSON.stringify(res.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `synapse_rl_dpo_dataset_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to export DPO dataset:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(TRL_SNIPPET);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border-white/[0.08] relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Direct Preference Optimization (DPO) Hub</h3>
              <span className="text-[10px] font-mono text-cyan-400">TRL & PyTorch Ready</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
            HuggingFace Format
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Serialized tuples containing prompt, chosen response, rejected response, dwell-time weighting, and qualitative micro-tags.
        </p>

        {/* Schema Attributes */}
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-slate-300">prompt: string</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-indigo-300">chosen: string</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-rose-300">rejected: string</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-300">dwell_ms: float</span>
        </div>

        {/* Code Snippet */}
        <div className="p-3 rounded-xl bg-slate-950/90 border border-white/[0.08] font-mono text-[11px] text-slate-300 relative group">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 pb-1 border-b border-white/[0.05]">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Python TRL Integration</span>
            <button
              type="button"
              onClick={handleCopySnippet}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="text-slate-400 overflow-x-auto text-[10.5px] leading-tight">
            {TRL_SNIPPET}
          </pre>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={downloading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-glow transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Dataset Downloaded (.json)</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? "Extracting SQLite Buffers..." : "Download Full DPO Dataset"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
