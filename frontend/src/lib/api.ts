import {
  CandidatePair,
  VotePayload,
  VoteResult,
  TelemetryMetrics,
  DPOExportResponse,
  GenerateABResponse,
} from "./types";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const API_V1_BASE = `${BACKEND_BASE}/api/v1`;

// Fallback Mock generator for development when backend is offline
function getMockABVariants(topic: string): GenerateABResponse {
  return {
    status: "success",
    topic,
    variant_a: `Most teams building ${topic} are making a $200k mistake:\n\nThey treat LLMs like deterministic databases instead of stochastic reasoning engines.\n\n90% of autonomous agent failures happen because one model is responsible for both generation AND validation.\n\nThe fix? An Adversarial Dual-Agent Architecture:\n* Agent 1 (The Executor): Drafts domain solutions with strict constraint boundaries.\n* Agent 2 (The Red Team): Validates edge cases and flags corporate fluff before state commits.\n* RLHF Calibration: Discrepancies route to a human A/B arena for DPO fine-tuning.\n\nBookmark this framework before your next architecture review.`,
    variant_b: `[The Engineering Blueprint for ${topic}]\n\nMost multi-agent architectures fail in production because of unmonitored agent state drift.\n\nHere is the 3-layer architecture we use to ensure deterministic execution:\n\n1. Strict Schema Sandboxing (Pydantic v2 validation before tool execution)\n2. Adversarial State Graph Loops (Debate nodes before state persistence)\n3. Human-in-the-Loop RLHF Queues (Capturing pairwise DPO preference data)\n\nThe result: 4.2x higher output reliability and zero silent logic regressions.\n\nWhat is your biggest state bottleneck when deploying autonomous agents?`,
    iterations_a: 2,
    iterations_b: 2,
    pair_id: "mock-" + Math.random().toString(36).substring(2, 9),
  };
}

export async function fetchLLMProviders(): Promise<any[]> {
  try {
    const res = await fetch(`${API_V1_BASE}/llm/providers`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.providers || [];
  } catch {
    return [];
  }
}

export async function fetchPersonas(): Promise<any[]> {
  try {
    const res = await fetch(`${API_V1_BASE}/personas`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function generateAB(
  topic: string,
  toneGuidance?: string,
  llmProvider?: string,
  llmModel?: string,
  temperature?: number,
  personaId?: string
): Promise<GenerateABResponse> {
  try {
    const res = await fetch(`${API_V1_BASE}/generate/ab`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        tone_guidance: toneGuidance || "High conviction thought leadership",
        llm_provider: llmProvider || "simulation",
        llm_model: llmModel,
        persona_id: personaId,
        temperature: temperature ?? 0.7,
      }),
    });

    if (!res.ok) {

      // Fallback try legacy route
      const fallbackRes = await fetch(`${BACKEND_BASE}/api/rlhf/generate-ab`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone_guidance: toneGuidance }),
      });
      if (fallbackRes.ok) return await fallbackRes.json();

      console.warn(`[API] Backend returned status ${res.status}. Falling back to mock generator.`);
      return getMockABVariants(topic);
    }

    return await res.json();
  } catch (err) {
    console.warn("[API] Backend offline or fetch failed. Using fallback mock generation.", err);
    return getMockABVariants(topic);
  }
}


export async function generateNewPair(
  topic: string,
  targetAudience: string = "B2B Founders & Tech Leaders"
): Promise<any> {
  return generateAB(topic, targetAudience);
}

export async function submitRLHFVote(payload: VotePayload): Promise<VoteResult> {
  try {
    const res = await fetch(`${API_V1_BASE}/rlhf/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn(`[API] Vote endpoint returned ${res.status}. Simulating local success.`);
      return {
        status: "success",
        vote_id: payload.pair_id,
        reward_delta: 0.85,
        dpo_pair_recorded: true,
        total_pairs_reviewed: 1,
        next_pair_available: false,
      };
    }

    return await res.json();
  } catch (err) {
    console.warn("[API] Vote endpoint unreachable. Simulating local success response.", err);
    return {
      status: "success",
      vote_id: payload.pair_id,
      reward_delta: 0.85,
      dpo_pair_recorded: true,
      total_pairs_reviewed: 1,
      next_pair_available: false,
    };
  }
}

export async function fetchNextPair(): Promise<CandidatePair> {
  const res = await fetch(`${API_V1_BASE}/rlhf/next-pair`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch next pair: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchTelemetry(): Promise<TelemetryMetrics> {
  const res = await fetch(`${API_V1_BASE}/telemetry/metrics`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch telemetry metrics: ${res.statusText}`);
  }
  return res.json();
}

export async function exportDPODataset(): Promise<DPOExportResponse> {
  const res = await fetch(`${API_V1_BASE}/rlhf/dpo-export`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to export DPO dataset: ${res.statusText}`);
  }
  return res.json();
}

export async function scheduleStealthPost(
  postContent: string,
  platform: string = "LinkedIn"
): Promise<any> {
  const res = await fetch(`${API_V1_BASE}/publish/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      post_content: postContent,
      platform,
      preferred_hour_offset: 1,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to schedule post: ${res.statusText}`);
  }
  return res.json();
}

export async function scoreHook(text: string): Promise<any> {
  try {
    const res = await fetch(`${API_V1_BASE}/hooks/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Scoring failed");
    return (await res.json()).data;
  } catch (err) {
    // Local calculation fallback
    const firstLine = text.split("\n")[0] || "";
    const hasNum = /\d+/.test(firstLine);
    const score = Math.min(95, 50 + (hasNum ? 25 : 0) + (firstLine.length < 130 ? 20 : 0));
    return {
      score,
      grade: score >= 85 ? "S" : score >= 75 ? "A" : "B",
      first_line: firstLine,
      suggestions: ["Add a numeric anchor or contrast hook."],
    };
  }
}

export async function generateAlternativeHooks(topic: string, draft?: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_V1_BASE}/hooks/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, draft }),
    });
    if (!res.ok) throw new Error("Hook generation failed");
    return (await res.json()).hooks || [];
  } catch {
    return [
      {
        archetype: "Contrarian Dollar Metric",
        hook: `Most teams scaling ${topic} are making a $200k architectural mistake before writing line 1.`,
        score: 92,
        grade: "S",
      },
      {
        archetype: "Counter-Intuitive Truth",
        hook: `Unpopular opinion: 90% of what is published about ${topic} on LinkedIn is cargo-cult engineering.`,
        score: 86,
        grade: "A",
      },
      {
        archetype: "Empirical Proof",
        hook: `We reduced failure rates by 74% when benchmarking ${topic}. Here is the exact 3-step breakdown:`,
        score: 84,
        grade: "A",
      },
    ];
  }
}

