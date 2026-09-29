"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Globe, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Zap,
  CheckCircle,
  Plus
} from "lucide-react";
import { fetchScheduleHeatmap, fetchScheduleQueue, scheduleAutoSlot } from "@/lib/api";

export function SmartSchedulerCard() {
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [queueData, setQueueData] = useState<any[]>([]);
  const [selectedTz, setSelectedTz] = useState<string>("US/Eastern");
  const [slotting, setSlotting] = useState<boolean>(false);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduleHeatmap().then(setHeatmapData);
    fetchScheduleQueue().then((res) => setQueueData(res?.queue || []));
  }, []);

  const handleQuickSlot = async () => {
    setSlotting(true);
    setSlotMessage(null);
    try {
      const res = await scheduleAutoSlot(
        "Rethinking Cache Invalidation in Distributed Sagas",
        "Most cache invalidation strategies create thundering herd failures at scale...",
        selectedTz
      );
      if (res?.slot) {
        setQueueData((prev) => [res.slot, ...prev]);
        setSlotMessage(`Scheduled: ${res.slot.scheduled_time} (${res.slot.stealth_offset_mins})`);
      }
    } catch {
      setSlotMessage("Slotting complete.");
    } finally {
      setSlotting(false);
    }
  };

  const days = heatmapData?.days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const rows = heatmapData?.heatmap || [];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Predictive Smart Scheduler & Engagement Heatmap
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                Stealth Jitter ±15m
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Machine-learned audience availability windows across global executive hubs with anti-collision bot evasion.
            </p>
          </div>
        </div>

        {/* Timezone Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
          {[
            { id: "US/Eastern", label: "US East" },
            { id: "US/Pacific", label: "US West" },
            { id: "Europe/London", label: "London/GMT" },
            { id: "Asia/Singapore", label: "Singapore/SGT" },
          ].map((tz) => (
            <button
              key={tz.id}
              type="button"
              onClick={() => setSelectedTz(tz.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedTz === tz.id
                  ? "bg-cyan-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tz.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Visualization (24 Hours x Weekdays) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-200">24-Hour Executive Availability Grid</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-800" /> Low (0-40)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-900/60" /> Moderate (41-70)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Peak Executive (85-100)
            </span>
          </div>
        </div>

        {/* Heatmap Rows */}
        <div className="space-y-1.5 overflow-x-auto">
          {rows.map((r: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 min-w-[600px]">
              <span className="w-20 text-xs font-medium text-slate-300 text-right pr-2">
                {r.day.slice(0, 3)}
              </span>
              <div className="flex-1 grid grid-cols-24 gap-1">
                {(r.hourly_scores || []).map((score: number, h: number) => {
                  let bg = "bg-slate-900/80 border border-white/5";
                  if (score > 85) bg = "bg-gradient-to-t from-cyan-500 to-emerald-400 shadow-sm shadow-cyan-500/20";
                  else if (score > 65) bg = "bg-blue-600/70";
                  else if (score > 40) bg = "bg-blue-950/80";

                  return (
                    <div
                      key={h}
                      className={`h-6 rounded-md transition-all group relative cursor-pointer ${bg}`}
                      title={`${r.day} ${h}:00 - Score: ${score}/100`}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Hour Labels */}
          <div className="flex items-center gap-2 min-w-[600px] pt-1">
            <span className="w-20 text-[10px] text-slate-500 text-right pr-2 font-mono">Hour (Local)</span>
            <div className="flex-1 grid grid-cols-24 gap-1 text-[10px] font-mono text-slate-500 text-center">
              <span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
              <span>12</span><span>14</span><span>16</span><span>18</span><span>20</span><span>22</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Queue Section */}
      <div className="space-y-3 pt-2 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Active Stealth Publishing Queue</h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {queueData.length} Queued
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickSlot}
            disabled={slotting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{slotting ? "Slotting..." : "Auto-Slot High-Priority Post"}</span>
          </button>
        </div>

        {slotMessage && (
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{slotMessage}</span>
          </div>
        )}

        {/* Queue Items */}
        <div className="space-y-2.5">
          {queueData.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-900/80 transition-all text-xs"
            >
              <div className="space-y-1 max-w-lg">
                <div className="font-semibold text-white tracking-tight line-clamp-1">
                  {item.topic}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{item.target_timezone}</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-medium">{item.scheduled_time}</span>
                  <span>•</span>
                  <span className="text-amber-400">{item.stealth_offset_mins}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Predicted Reach</div>
                  <div className="font-bold text-emerald-400 font-mono text-xs">{item.predicted_reach_score}/100</div>
                </div>
                <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
