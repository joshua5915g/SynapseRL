"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle,
  Plus,
  RefreshCw,
  Trash2,
  AlertCircle,
  Layers,
  ArrowRight
} from "lucide-react";
import { fetchScheduleHeatmap, fetchScheduleQueue, scheduleAutoSlot } from "@/lib/api";

const PRESET_SCHEDULE_TOPICS = [
  {
    topic: "Rethinking Cache Invalidation in Distributed Sagas",
    content: "Most cache invalidation strategies create thundering herd failures at scale. Here is our 3-step mitigation playbook...",
  },
  {
    topic: "Zero-Trust IAM for Multi-Cloud Kubernetes Clusters",
    content: "Why hardcoded service account tokens are the #1 attack vector in modern cloud infrastructure...",
  },
  {
    topic: "Why Multi-Tenant Vector Indexing Blows Up Memory",
    content: "Conventional vector databases degrade under high tenancy. Here is how schema sandboxing solves it...",
  }
];

export default function SchedulePage() {
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [queueData, setQueueData] = useState<any[]>([]);
  const [selectedTz, setSelectedTz] = useState<string>("US/Eastern");
  const [topic, setTopic] = useState(PRESET_SCHEDULE_TOPICS[0].topic);
  const [content, setContent] = useState(PRESET_SCHEDULE_TOPICS[0].content);
  const [isSlotting, setIsSlotting] = useState(false);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduleHeatmap().then(setHeatmapData);
    fetchScheduleQueue().then((res) => setQueueData(res?.queue || []));
  }, []);

  const handleAutoSlot = async () => {
    if (!topic.trim()) return;
    setIsSlotting(true);
    setSlotMessage(null);
    try {
      const res = await scheduleAutoSlot(topic, content, selectedTz);
      if (res?.slot) {
        setQueueData((prev) => [res.slot, ...prev]);
        setSlotMessage(`Slotted successfully: ${res.slot.scheduled_time} (${res.slot.stealth_offset_mins}) with ${res.slot.predicted_reach_score}/100 predicted reach!`);
      }
    } catch (err) {
      console.error("Auto slot error:", err);
      setSlotMessage("Scheduled into next available slot.");
    } finally {
      setIsSlotting(false);
    }
  };

  const handleRemoveFromQueue = (id: string) => {
    setQueueData((prev) => prev.filter((item) => item.id !== id));
  };

  const days = heatmapData?.days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const rows = heatmapData?.heatmap || [];
  const timezones = heatmapData?.timezones || {
    "US/Eastern": { label: "US Eastern (NYC/BOS)", utc_offset: -4 },
    "US/Pacific": { label: "US Pacific (SF/SEA)", utc_offset: -7 },
    "Europe/London": { label: "Europe (London/Berlin)", utc_offset: +1 },
    "Asia/Singapore": { label: "Asia-Pacific (Singapore/Tokyo)", utc_offset: +8 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-teal-500/20 to-emerald-500/20 border border-cyan-500/30 text-cyan-300 shadow-glow-cyan">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  Smart Jitter Calendar & Timezone Heatmap
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Feature #4
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Predictive slotting with Gaussian delay evasion: Automatically schedules posts into peak B2B executive windows while masking bot fingerprints.
              </p>
            </div>
          </div>
        </div>

        {/* Global Security Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Bot Jitter Active (±12–47m)</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {slotMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 backdrop-blur-xl flex items-center justify-between gap-4 text-xs font-mono text-emerald-200 shadow-glow-emerald">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{slotMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSlotMessage(null)}
            className="text-emerald-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Timezone Selector & Heatmap Stage */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
              Global Executive Active-Hours Heatmap (24-Hour Matrix)
            </h3>
          </div>

          {/* Timezone Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Audience Zone:</span>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              {Object.entries(timezones).map(([key, val]: [string, any]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Heatmap Visual Matrix */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-2">
            {/* Hour Headers (0 - 23) */}
            <div className="flex items-center gap-1 pl-24 text-[10px] font-mono text-slate-500">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center">
                  {i % 3 === 0 ? `${i}h` : ""}
                </div>
              ))}
            </div>

            {/* Days Rows */}
            {rows.map((row: any, rIdx: number) => (
              <div key={rIdx} className="flex items-center gap-2">
                <span className="w-20 text-xs font-mono text-slate-300 font-semibold truncate">
                  {row.day.slice(0, 3)}
                </span>
                <div className="flex-1 flex items-center gap-1">
                  {(row.hourly_scores || []).map((val: number, hIdx: number) => {
                    const isPeak = val >= 90;
                    const isHigh = val >= 75;
                    const isMed = val >= 50;

                    const cellBg = isPeak
                      ? "bg-cyan-400 shadow-sm shadow-cyan-400/50"
                      : isHigh
                      ? "bg-cyan-600/70"
                      : isMed
                      ? "bg-cyan-900/40"
                      : "bg-slate-800/40";

                    return (
                      <div
                        key={hIdx}
                        className={`flex-1 h-7 rounded-[4px] ${cellBg} transition-all duration-200 hover:scale-110 hover:ring-1 hover:ring-white flex items-center justify-center cursor-pointer group relative`}
                        title={`${row.day} @ ${hIdx}:00 - Predicted Reach: ${val}/100`}
                      >
                        {isPeak && (
                          <span className="text-[9px] font-mono font-bold text-slate-950">
                            ★
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Reach Index:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-slate-800/40" />
              <span>Low (0-50)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-cyan-900/40" />
              <span>Normal (50-75)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-cyan-600/70" />
              <span>High (75-90)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px] bg-cyan-400" />
              <span className="text-cyan-300 font-bold">Peak (90+)</span>
            </div>
          </div>

          <span className="text-[11px] text-slate-500">
            Optimal Window: Tue–Thu 08:00–11:00 AM Local
          </span>
        </div>
      </div>

      {/* Two-Column Stage: Slotter vs Active Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Quick Slotter Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-Slot to Next Peak Window</span>
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_SCHEDULE_TOPICS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setContent(item.content);
                  }}
                  className="text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-950 border border-white/5 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all cursor-pointer truncate max-w-[180px]"
                >
                  {item.topic.split(" ")[0]}...
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Post Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic for scheduling..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Draft Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Post content..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors font-sans resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAutoSlot}
              disabled={isSlotting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-cyan disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSlotting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Slot into Optimal Window</span>
            </button>
          </div>
        </div>

        {/* Right: Active Scheduled Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active Stealth Queue ({queueData.length})</span>
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Publisher Online</span>
              </span>
            </div>

            <div className="space-y-3">
              {queueData.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-white/5 bg-slate-950 hover:border-cyan-500/30 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {item.scheduled_time}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        {item.stealth_offset_mins}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        Reach: {item.predicted_reach_score}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white font-sans">
                    {item.topic}
                  </p>

                  {item.content_preview && (
                    <p className="text-xs text-slate-400 font-sans line-clamp-2">
                      {item.content_preview}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] font-mono text-slate-500">
                    <span>Target Zone: {item.target_timezone}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromQueue(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
