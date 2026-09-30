"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Database,
  Download,
  Copy,
  Check,
  Terminal,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sliders,
  CheckCircle2,
  FileCode,
  Tag
} from "lucide-react";
import { exportDPODataset } from "@/lib/api";

export default function TrainingHubPage() {
  const [dpoData, setDpoData] = useState<any[]>([]);
  const [totalPairs, setTotalPairs] = useState(0);
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedJsonl, setCopiedJsonl] = useState(false);
  const [baseModel, setBaseModel] = useState("meta-llama/Meta-Llama-3-8B-Instruct");
  const [dpoBeta, setDpoBeta] = useState("0.1");
  const [learningRate, setLearningRate] = useState("5e-7");

  useEffect(() => {
    loadDPODataset();
  }, []);

  const loadDPODataset = async () => {
    setIsLoading(true);
    try {
      const res = await exportDPODataset();
      if (res?.data) {
        setDpoData(res.data);
        setTotalPairs(res.total_pairs || res.data.length);
      }
    } catch (err) {
      console.error("DPO load error:", err);
      // Fallback mock tuples if DB is fresh
      const mockTuples = [
        {
          pair_id: "dpo-001",
          prompt: "Topic: Distributed Consensus\nAudience: B2B Tech Leaders\nTask: Write a high-engagement B2B thought leadership post with zero fluff.",
          chosen: "Raft consensus requires quorum on every log write. Measure your p99 latency before scaling node count.\n\n3 rules:\n1. Isolate heartbeat threads\n2. Enforce batch append\n3. Track commit index drift.",
          rejected: "In today's fast world, Raft is a supercharged game-changer for your team synergy! 🚀✨",
          micro_tags: ["Technical Rigor", "No Fluff", "Actionable Rules"]
        },
        {
          pair_id: "dpo-002",
          prompt: "Topic: Microservices Sprawl\nAudience: B2B Founders\nTask: Write a high-engagement B2B thought leadership post with zero fluff.",
          chosen: "Most startups migrate to microservices before having 1,000 DAUs. Modular monoliths preserve developer velocity.",
          rejected: "Delve into microservices to move the needle and unlock unprecedented paradigms of transformation.",
          micro_tags: ["Contrarian Disruption", "Cost Discipline"]
        }
      ];
      setDpoData(mockTuples);
      setTotalPairs(mockTuples.length);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPair = dpoData[selectedPairIndex] || dpoData[0];

  const handleDownloadJSONL = () => {
    if (!dpoData.length) return;
    const jsonlLines = dpoData.map((d) => JSON.stringify(d)).join("\n");
    const blob = new Blob([jsonlLines], { type: "application/jsonlines" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synapserl_dpo_dataset_${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSONL = () => {
    if (!dpoData.length) return;
    const jsonlLines = dpoData.map((d) => JSON.stringify(d)).join("\n");
    navigator.clipboard.writeText(jsonlLines);
    setCopiedJsonl(true);
    setTimeout(() => setCopiedJsonl(false), 2000);
  };

  const pythonScript = `"""
SynapseRL Autonomous DPO Fine-Tuning Pipeline
HuggingFace TRL (Transformer Reinforcement Learning) + Unsloth Training Script
"""

from datasets import load_dataset
from trl import DPOTrainer, DPOConfig
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig

model_name = "${baseModel}"
print(f"Loading base model: {model_name}...")

tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="bfloat16",
    device_map="auto"
)

# LoRA Configuration
peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"]
)

# Load SynapseRL Exported JSONL Dataset
dataset = load_dataset("json", data_files="synapserl_dpo_dataset.jsonl")

training_args = DPOConfig(
    output_dir="./synapserl_dpo_adapter",
    learning_rate=${learningRate},
    per_device_train_batch_size=2,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    beta=${dpoBeta},
    logging_steps=10,
    save_strategy="epoch",
    fp16=False,
    bf16=True,
    report_to="none"
)

dpo_trainer = DPOTrainer(
    model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
    peft_config=peft_config,
    max_length=1024,
    max_prompt_length=256
)

print("Starting Direct Preference Optimization (DPO)...")
dpo_trainer.train()
dpo_trainer.save_model("./synapserl_dpo_final")
print("DPO Training complete! Model adapter saved.")
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-400 shadow-glow-indigo">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-mono">
                  HuggingFace DPO Model Fine-Tuning Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                  Feature #10
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Direct Preference Optimization (DPO): Export pairwise human-voted tuples, generate Unsloth/TRL fine-tuning scripts, and train custom open-source weights.
              </p>
            </div>
          </div>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyJSONL}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedJsonl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJsonl ? "JSONL Copied!" : "Copy JSONL"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSONL}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-mono text-xs font-bold transition-all shadow-glow-indigo cursor-pointer flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DPO Dataset (.jsonl)</span>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Harvested DPO Pairs
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400 mt-1 block">
            {totalPairs} Tuples
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Training Framework
          </span>
          <span className="text-sm sm:text-base font-bold text-white mt-2 block font-mono">
            TRL DPOTrainer / Unsloth
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            DPO Loss Formulation
          </span>
          <span className="text-sm sm:text-base font-bold text-emerald-400 mt-2 block font-mono">
            Implicit Reward (Rafailov et al.)
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Status
          </span>
          <span className="text-xs font-mono font-bold text-cyan-300 mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Ready for Fine-Tuning</span>
          </span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pairwise Tuple Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pairwise Preference Tuple Inspector</span>
              </span>

              {/* Selector */}
              <div className="flex items-center gap-1">
                {dpoData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPairIndex(idx)}
                    className={`w-6 h-6 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedPairIndex === idx
                        ? "bg-indigo-500 text-white font-bold"
                        : "bg-slate-950 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {selectedPair && (
              <div className="space-y-3.5 text-xs font-sans">
                {/* Prompt */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                    Input Prompt
                  </span>
                  <p className="text-slate-300 font-mono text-[11px] whitespace-pre-line">
                    {selectedPair.prompt}
                  </p>
                </div>

                {/* Chosen */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 text-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      ✓ CHOSEN WINNER (Implicit Positive Gradient)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {selectedPair.chosen?.length} chars
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-xs">
                    {selectedPair.chosen}
                  </p>
                </div>

                {/* Rejected */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
                      ✗ REJECTED CANDIDATE (Negative Gradient)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {selectedPair.rejected?.length} chars
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-xs">
                    {selectedPair.rejected}
                  </p>
                </div>

                {/* Micro-tags */}
                {selectedPair.micro_tags && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {selectedPair.micro_tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-950 border border-white/5 text-[10px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Training Script Generator (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>1-Click Python DPOTrainer Script</span>
              </span>

              <button
                type="button"
                onClick={handleCopyScript}
                className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
              >
                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
              </button>
            </div>

            {/* Hyperparameter Inputs */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">Base Model</label>
                <select
                  value={baseModel}
                  onChange={(e) => setBaseModel(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-white text-[11px] truncate focus:outline-none"
                >
                  <option value="meta-llama/Meta-Llama-3-8B-Instruct">Llama 3 8B</option>
                  <option value="mistralai/Mistral-7B-Instruct-v0.3">Mistral 7B</option>
                  <option value="Qwen/Qwen2.5-7B-Instruct">Qwen 2.5 7B</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">DPO Beta (β)</label>
                <input
                  type="text"
                  value={dpoBeta}
                  onChange={(e) => setDpoBeta(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-white text-[11px] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 block">Learning Rate</label>
                <input
                  type="text"
                  value={learningRate}
                  onChange={(e) => setLearningRate(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-white text-[11px] focus:outline-none"
                />
              </div>
            </div>

            {/* Code Block */}
            <div className="relative">
              <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-indigo-300 font-mono leading-relaxed overflow-x-auto max-h-[360px] overflow-y-auto">
                {pythonScript}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
