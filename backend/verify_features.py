"""End-to-end verification script for all 10 newly built SynapseRL features."""

import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def run_feature_checks():
    results = {}
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        
        # 1. Multi-Provider LLM Engine
        try:
            r = await client.get("/api/v1/llm/providers")
            data = r.json()
            assert r.status_code == 200
            assert "providers" in data
            provider_names = [p["id"] for p in data["providers"]]
            results["Feature 1: Multi-Provider LLM Engine"] = (
                True, f"200 OK | Available providers: {provider_names}"
            )
        except Exception as e:
            results["Feature 1: Multi-Provider LLM Engine"] = (False, str(e))

        # 2. Viral Hook Optimizer & Scorer
        try:
            r_score = await client.post("/api/v1/hooks/score", json={
                "text": "Most teams scaling Kubernetes make a $200k security mistake."
            })
            r_gen = await client.post("/api/v1/hooks/generate", json={
                "topic": "Zero-Day Kubernetes Vulnerabilities"
            })
            assert r_score.status_code == 200
            assert r_gen.status_code == 200
            score_data = r_score.json()["data"]
            gen_data = r_gen.json()["hooks"]
            score = score_data.get("virality_score", score_data.get("score"))
            results["Feature 2: Viral Hook Scorer & Generator"] = (
                True, f"200 OK | Virality: {score}/100, Generated {len(gen_data)} archetypes"
            )
        except Exception as e:
            results["Feature 2: Viral Hook Scorer & Generator"] = (False, str(e))

        # 3. Persona Engine
        try:
            r = await client.get("/api/v1/personas")
            data = r.json()
            assert r.status_code == 200
            personas = [p["id"] for p in data]
            assert len(personas) >= 3
            results["Feature 3: Ghostwriter Persona Engine"] = (
                True, f"200 OK | Active personas: {personas}"
            )
        except Exception as e:
            results["Feature 3: Ghostwriter Persona Engine"] = (False, str(e))

        # 4. Adversarial Debate Replay & Diff Data
        try:
            r = await client.post("/api/v1/generate/ab", json={
                "topic": "High-Throughput Vector Ingestion",
                "llm_provider": "simulation",
                "tone_guidance": "High conviction thought leadership"
            })
            assert r.status_code == 200
            data = r.json()
            assert "variant_a" in data
            assert "variant_b" in data
            results["Feature 4: Adversarial Debate Pipeline"] = (
                True, f"200 OK | Concurrent generation produces Candidate A ({len(data['variant_a'])} chars) & B ({len(data['variant_b'])} chars)"
            )
        except Exception as e:
            results["Feature 4: Adversarial Debate Pipeline"] = (False, str(e))

        # 5. Corporate Cliche Linter & De-Fluffer
        try:
            sample_cringe = "In today's fast-moving world, our game-changer will revolutionize your synergy tapestry."
            r_audit = await client.post("/api/v1/linter/audit", json={"text": sample_cringe})
            assert r_audit.status_code == 200
            audit_data = r_audit.json()["data"]
            assert "authenticity_score" in audit_data
            assert "de_fluffed_text" in audit_data
            results["Feature 5: Cringe Hunter & De-Fluffer"] = (
                True, f"200 OK | Authenticity: {audit_data['authenticity_score']}/100, Flagged {audit_data['total_cliches']} buzzwords, Cleaned: '{audit_data['de_fluffed_text'][:45]}...'"
            )
        except Exception as e:
            results["Feature 5: Cringe Hunter & De-Fluffer"] = (False, str(e))

        # 6. Analytics Ingestion & Empirical Reward Feedback Loop
        try:
            r = await client.post("/api/v1/analytics/ingest", json={
                "post_id": "test-post-01",
                "impressions": 15400,
                "reactions": 420,
                "comments": 85,
                "reposts": 28,
                "clicks": 310
            })
            assert r.status_code == 200
            data = r.json()["data"]
            reward = data.get("calculated_reward", data.get("empirical_reward"))
            assert reward is not None
            results["Feature 6: Empirical Analytics Ingestion"] = (
                True, f"200 OK | Empirical reward calculated: {reward}/10.0"
            )
        except Exception as e:
            results["Feature 6: Empirical Analytics Ingestion"] = (False, str(e))

        # 7. Multi-Platform Cross-Publishing Formatter
        try:
            r = await client.post("/api/v1/format/multi-platform", json={
                "topic": "Microservices vs Monoliths",
                "content": "Paragraph 1: Monoliths are simpler.\n\nParagraph 2: Microservices introduce network boundaries.\n\nParagraph 3: Measure before splitting."
            })
            assert r.status_code == 200
            fmt = r.json()["data"]
            assert len(fmt["x_thread"]) >= 3
            assert "substack_markdown" in fmt
            results["Feature 7: Multi-Platform Cross-Formatter"] = (
                True, f"200 OK | X Thread: {fmt['x_tweet_count']} tweets, Substack: {len(fmt['substack_markdown'])} chars"
            )
        except Exception as e:
            results["Feature 7: Multi-Platform Cross-Formatter"] = (False, str(e))

        # 8. LinkedIn Document Carousel Generator
        try:
            r = await client.post("/api/v1/carousel/generate", json={
                "topic": "Multi-Tenant Database Isolation",
                "content": "Most multi-tenant architectures bleed memory.\n\nRule 1: Isolate schemas.\nRule 2: Restrict connection pools.",
                "theme": "indigo"
            })
            assert r.status_code == 200
            data = r.json()
            assert data["total_slides"] == 6
            assert len(data["printable_html"]) > 1000
            results["Feature 8: LinkedIn Document Carousel"] = (
                True, f"200 OK | {data['total_slides']} 4:5 cards generated, Printable HTML: {len(data['printable_html'])} chars"
            )
        except Exception as e:
            results["Feature 8: LinkedIn Document Carousel"] = (False, str(e))

        # 9. LLM-as-a-Judge Synthetic RLHF Bootstrapper
        try:
            r = await client.post("/api/v1/rlhf/synthetic/evaluate", json={
                "topic": "Distributed Consensus",
                "variant_a": "Raft consensus requires quorum on every log write. Measure your p99 latency before scaling node count.",
                "variant_b": "In today's fast world, Raft is a supercharged game-changer for your team synergy.",
                "auto_record_dpo": True
            })
            assert r.status_code == 200
            data = r.json()
            assert "winner" in data
            assert data["winner"] == "candidate_a"
            results["Feature 9: LLM-as-a-Judge Bootstrapper"] = (
                True, f"200 OK | Winner: {data['winner_label']} (+{data['score_margin']} margin) | DPO delta: +{data['dpo_record']['reward_delta']}"
            )
        except Exception as e:
            results["Feature 9: LLM-as-a-Judge Bootstrapper"] = (False, str(e))

        # 10. Predictive Smart Scheduler & Global Heatmap
        try:
            r_heat = await client.get("/api/v1/schedule/heatmap")
            assert r_heat.status_code == 200
            r_slot = await client.post("/api/v1/schedule/auto-slot", json={
                "topic": "Event-Driven State Invalidation",
                "content": "Sample content",
                "timezone": "US/Eastern"
            })
            assert r_slot.status_code == 200
            slot = r_slot.json()["slot"]
            results["Feature 10: Smart Scheduler & Heatmap"] = (
                True, f"200 OK | Slotted at: {slot['scheduled_time']} ({slot['stealth_offset_mins']}) | Reach: {slot['predicted_reach_score']}/100"
            )
        except Exception as e:
            results["Feature 10: Smart Scheduler & Heatmap"] = (False, str(e))

    print("\n" + "="*80)
    print("                SYNAPSERL 10-FEATURE VERIFICATION REPORT")
    print("="*80)
    all_passed = True
    for feat, (passed, msg) in results.items():
        status_tag = "PASS" if passed else "FAIL"
        if not passed:
            all_passed = False
        print(f"[{status_tag}] {feat}")
        print(f"       Details: {msg}\n")
    print("="*80)
    print(f"Overall Result: {'ALL 10 FEATURES OPERATIONAL & VERIFIED!' if all_passed else 'SOME CHECKS FAILED'}")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(run_feature_checks())
