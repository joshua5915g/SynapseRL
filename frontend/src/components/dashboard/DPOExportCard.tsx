"use client";

import React, { useState } from "react";
import { Download, Database, Check, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportDPODataset } from "@/lib/api";

export function DPOExportCard() {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-sm text-white">DPO Training Export</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Export labeled prompt-chosen-rejected tuples formatted for Direct Preference Optimization with HuggingFace TRL or PyTorch.
        </p>
      </div>

      <div className="pt-2 border-t border-slate-800/80">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={downloading}
          className="w-full justify-center gap-2 text-xs"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Exported JSONL Ready
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Formatting..." : "Download DPO Dataset (JSON)"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
