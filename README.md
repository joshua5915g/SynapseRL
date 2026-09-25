# SynapseRL: Autonomous B2B Content Engine

An enterprise-grade autonomous B2B thought-leadership content engine powered by a **LangGraph Adversarial Multi-Agent Graph** and **Reinforcement Learning from Human Feedback (RLHF)** with Direct Preference Optimization (DPO) dataset export.

---

## Architecture Overview

```
                  ┌───────────────────────────────────────────────┐
                  │                 USER PROMPT                   │
                  └──────────────────────┬────────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │       ADVERSARIAL AGENT GRAPH (LangGraph)       │
                 │                                                 │
                 │   [SME Writer]  <───Feedback──>  [Algo Hacker]  │
                 │    Domain Depth                   Viral Hooks   │
                 └───────────────────────┬─────────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │             PAIR SYNTHESIZER (A vs B)           │
                 │   Candidate A (Contrarian) vs Candidate B (Eng) │
                 └───────────────────────┬─────────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │            RLHF "SWIPE" ARENA (Next.js)         │
                 │   Side-by-side vote + Micro-Tags + Dwell Time   │
                 └───────────────┬─────────────────────┬───────────┘
                                 │                     │
                    [Winner to Jitter Queue]   [Pairwise DPO Tuple]
                                 │                     │
                                 ▼                     ▼
                     Stealth LinkedIn Publisher    SQLite DPO Database
                     (Gaussian Delay Evasion)     (HuggingFace TRL Ready)
```

---

## Directory Structure

```
/
├── frontend/                     # Next.js 15, React 19, TypeScript, Tailwind, Recharts
│   ├── src/app/                  # App Router pages (Mission Control, Arena, Telemetry)
│   ├── src/components/arena/     # RLHF SwipeArena, PostCard, MicroTagPicker, Shortcuts
│   ├── src/components/dashboard/ # TelemetryChart, StatCard, DPOExportCard
│   ├── src/lib/                  # API client, types, utility helpers
│   └── package.json
│
├── backend/                      # Python 3.11+, FastAPI, LangGraph, SQLAlchemy, SQLite
│   ├── app/agents/               # SME Writer, Algorithm Hacker, Synthesizer Graph
│   ├── app/api/routes/           # /generate, /rlhf/vote, /telemetry, /publish
│   ├── app/db/                   # SQLAlchemy async engine, SQLite models & CRUD
│   ├── app/models/               # Pydantic v2 schemas
│   ├── app/services/             # Stealth publisher with jitter, Reward calculator, DPO export
│   └── requirements.txt
│
└── README.md
```

---

## Quick Start

### 1. Running the Backend (FastAPI)

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / Mac
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

FastAPI OpenAPI Interactive Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Running the Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Web Interface: [http://localhost:3000](http://localhost:3000)

---

## Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/generate` | Run adversarial LangGraph to generate Candidate A & B |
| `GET` | `/api/v1/rlhf/next-pair` | Fetch the next unreviewed candidate pair for arena |
| `POST` | `/api/v1/rlhf/vote` | Record human preference decision, micro-tags, and dwell time |
| `GET` | `/api/v1/rlhf/dpo-export` | Export dataset formatted for Direct Preference Optimization (DPO) |
| `GET` | `/api/v1/telemetry/metrics` | Retrieve live reward curves and tag distributions |
| `POST` | `/api/v1/publish/schedule` | Schedule stealth LinkedIn publishing with anti-ban jitter |
