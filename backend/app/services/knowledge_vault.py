"""
SynapseRL Knowledge Vault & Brand Voice DNA Ingestion Engine.
Manages enterprise knowledge assets, founder transcripts, past viral posts,
and extracts style vectors (cadence, vocabulary, banned phrases) for RAG conditioning.
"""

import os
import re
import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

VAULT_STORAGE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "vault_store.json")


class VaultDocument:
    def __init__(
        self,
        doc_id: str,
        title: str,
        content: str,
        doc_type: str,
        tags: List[str],
        created_at: str,
        style_metrics: Dict[str, Any]
    ):
        self.doc_id = doc_id
        self.title = title
        self.content = content
        self.doc_type = doc_type  # 'viral_post', 'podcast_transcript', 'whitepaper', 'notes'
        self.tags = tags
        self.created_at = created_at
        self.style_metrics = style_metrics

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.doc_id,
            "title": self.title,
            "content": self.content,
            "doc_type": self.doc_type,
            "tags": self.tags,
            "created_at": self.created_at,
            "style_metrics": self.style_metrics,
        }


class KnowledgeVaultService:
    def __init__(self):
        self._ensure_storage()
        self._docs: List[Dict[str, Any]] = self._load()

    def _ensure_storage(self):
        folder = os.path.dirname(VAULT_STORAGE_PATH)
        os.makedirs(folder, exist_ok=True)
        if not os.path.exists(VAULT_STORAGE_PATH):
            default_seed = [
                {
                    "id": "seed-1",
                    "title": "Scaling Monolith to Microservices Post-Mortem",
                    "content": "Most engineering leaders migrate to microservices too early because of resume-driven development. In 2024, our latency tripled when we split our core payment service into 14 gRPC microservices. We consolidated 8 of them back into a modular monolith and cut cloud costs by 42%.",
                    "doc_type": "viral_post",
                    "tags": ["architecture", "cost-optimization", "contrarian"],
                    "created_at": datetime.utcnow().isoformat(),
                    "style_metrics": {
                        "avg_sentence_len": 18.2,
                        "vocabulary_richness": 0.81,
                        "primary_tone": "Contrarian Pragmatist",
                        "banned_buzzwords": ["synergy", "paradigm shift", "leverage"]
                    }
                },
                {
                    "id": "seed-2",
                    "title": "B2B SaaS Pricing Playbook: Usage vs Per-Seat",
                    "content": "Per-seat pricing penalizes your champion for spreading your product internally. When we flipped our billing model from $49/seat/mo to $0.05 per AI inference event, net revenue retention (NRR) jumped from 104% to 138% in two quarters. Align pricing with client value, not headcount.",
                    "doc_type": "whitepaper",
                    "tags": ["pricing", "saas-metrics", "growth"],
                    "created_at": datetime.utcnow().isoformat(),
                    "style_metrics": {
                        "avg_sentence_len": 16.5,
                        "vocabulary_richness": 0.78,
                        "primary_tone": "Analytical Executive",
                        "banned_buzzwords": ["game changer", "revolutionary", "disrupt"]
                    }
                }
            ]
            with open(VAULT_STORAGE_PATH, "w", encoding="utf-8") as f:
                json.dump(default_seed, f, indent=2)

    def _load(self) -> List[Dict[str, Any]]:
        try:
            with open(VAULT_STORAGE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _save(self):
        try:
            with open(VAULT_STORAGE_PATH, "w", encoding="utf-8") as f:
                json.dump(self._docs, f, indent=2)
        except Exception as e:
            print(f"[KnowledgeVault] Save failed: {e}")

    def analyze_style_dna(self, text: str) -> Dict[str, Any]:
        """Calculates linguistic style metrics and cadence."""
        sentences = [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]
        words = re.findall(r"\b[A-Za-z0-9'-]+\b", text)
        
        avg_sentence_len = round(len(words) / max(len(sentences), 1), 1)
        unique_words = len(set(w.lower() for w in words))
        richness = round(unique_words / max(len(words), 1), 2)
        
        # Tone heuristic
        contrarian_markers = ["most", "never", "myth", "wrong", "mistake", "penalizes", "stop", "consolidated"]
        analytical_markers = ["data", "retention", "metrics", "percentage", "%", "latency", "revenue", "cost"]
        
        c_score = sum(1 for m in contrarian_markers if m in text.lower())
        a_score = sum(1 for m in analytical_markers if m in text.lower())
        
        if c_score >= a_score and c_score > 0:
            tone = "Contrarian Thought-Leader"
        elif a_score > c_score:
            tone = "Analytical Technical Strategist"
        else:
            tone = "Pragmatic Visionary"
            
        banned = ["synergy", "delve", "testament", "tapestry", "game changer", "unlock", "harness"]
        detected_cliches = [b for b in banned if b in text.lower()]
        
        return {
            "avg_sentence_len": avg_sentence_len,
            "vocabulary_richness": richness,
            "primary_tone": tone,
            "word_count": len(words),
            "sentence_count": len(sentences),
            "detected_cliches": detected_cliches,
            "banned_buzzwords": banned
        }

    def ingest_document(
        self,
        title: str,
        content: str,
        doc_type: str = "notes",
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        metrics = self.analyze_style_dna(content)
        doc = {
            "id": f"doc-{uuid.uuid4().hex[:8]}",
            "title": title.strip() or "Untitled Document",
            "content": content.strip(),
            "doc_type": doc_type,
            "tags": tags or ["custom", "vault"],
            "created_at": datetime.utcnow().isoformat(),
            "style_metrics": metrics
        }
        self._docs.insert(0, doc)
        self._save()
        return doc

    def list_documents(self) -> List[Dict[str, Any]]:
        return self._docs

    def delete_document(self, doc_id: str) -> bool:
        initial_len = len(self._docs)
        self._docs = [d for d in self._docs if d.get("id") != doc_id]
        if len(self._docs) < initial_len:
            self._save()
            return True
        return False

    def query_rag_context(self, topic: str, max_results: int = 2) -> Dict[str, Any]:
        """Simple keyword-scoring RAG retrieval over vault documents."""
        topic_words = set(re.findall(r"\b[A-Za-z0-9]+\b", topic.lower()))
        scored = []
        for doc in self._docs:
            doc_text = (doc.get("title", "") + " " + doc.get("content", "") + " " + " ".join(doc.get("tags", []))).lower()
            score = sum(1 for w in topic_words if w in doc_text)
            scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        top_matches = [item[1] for item in scored[:max_results]]
        
        context_snippets = [f"[{m.get('title')}]: {m.get('content')[:280]}..." for m in top_matches]
        
        return {
            "matched_count": len(top_matches),
            "snippets": context_snippets,
            "recommended_tone": top_matches[0]["style_metrics"]["primary_tone"] if top_matches else "Contrarian Pragmatist",
            "suggested_angles": [m.get("title") for m in top_matches]
        }


vault_service = KnowledgeVaultService()
