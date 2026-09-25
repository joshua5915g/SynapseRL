"use client";

import React from "react";
import { Keyboard } from "lucide-react";

export function ArenaShortcuts() {
  return (
    <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
      <span className="flex items-center gap-1.5 text-slate-300 font-sans font-medium">
        <Keyboard className="w-3.5 h-3.5 text-indigo-400" /> Hotkeys:
      </span>
      <div className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">←</kbd>
        <span>Vote Option A</span>
      </div>
      <div className="flex items-center gap-1.5">
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">→</kbd>
        <span>Vote Option B</span>
      </div>
      <div className="flex items-center gap-1.5">
        <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">Space</kbd>
        <span>Tie / Skip</span>
      </div>
    </div>
  );
}
