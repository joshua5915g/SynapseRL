export interface CandidatePair {
  id: string;
  topic: string;
  target_audience: string;
  candidate_a: string;
  candidate_b: string;
  is_reviewed: boolean;
  created_at: string;
}

export interface GhostwriterPersona {
  id: string;
  name: string;
  role_title: string;
  bio: string;
  tone_characteristics: string[];
  preferred_keywords: string[];
  forbidden_words: string[];
  hook_archetype: string;
  signature_cta: string;
  is_custom?: boolean;
}

export interface GenerateABRequest {
  topic: string;
  tone_guidance?: string;
  llm_provider?: string;
  llm_model?: string;
  persona_id?: string;
  temperature?: number;
}


export interface GenerateABResponse {
  status: string;
  topic: string;
  variant_a: string;
  variant_b: string;
  iterations_a: number;
  iterations_b: number;
  pair_id?: string;
  provider_used?: string;
  drafts_a?: string[];
  critiques_a?: string[];
  drafts_b?: string[];
  critiques_b?: string[];
}


export interface VotePayload {
  pair_id: string;
  chosen_id: "candidate_a" | "candidate_b" | "tie";
  rejected_id?: string;
  micro_tags: string[];
  dwell_time_ms: number;
  confidence_rating: number;
  feedback_notes?: string;
}

export interface VoteResult {
  status: string;
  vote_id: string;
  reward_delta: number;
  dpo_pair_recorded: boolean;
  total_pairs_reviewed: number;
  next_pair_available: boolean;
}

export interface TimeSeriesPoint {
  timestamp: string;
  reward_score: number;
  impressions: number;
  engagement_rate: number;
}

export interface TelemetryMetrics {
  total_reviewed: number;
  total_pending: number;
  a_win_rate: number;
  b_win_rate: number;
  mean_reward_score: number;
  tag_distribution: Record<string, number>;
  reward_curve: TimeSeriesPoint[];
  system_status: string;
}

export interface DPOItem {
  pair_id: string;
  prompt: string;
  chosen: string;
  rejected: string;
  micro_tags: string[];
}

export interface DPOExportResponse {
  total_pairs: number;
  data: DPOItem[];
}
