"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  badge?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  subtitle,
  badge,
}: StatCardProps) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border-white/[0.08] relative overflow-hidden group">
      {/* Top subtle glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400 font-mono tracking-tight">{title}</span>
          <div className="p-2 rounded-xl bg-slate-950/70 border border-white/[0.08] text-indigo-400 group-hover:text-cyan-400 group-hover:scale-105 transition-all">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">{value}</div>
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/[0.05] text-xs">
        {change && (
          <span
            className={`inline-flex items-center gap-1 font-mono font-medium ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
        {subtitle && <span className="text-slate-500 text-[11px] truncate">{subtitle}</span>}
      </div>
    </div>
  );
}
