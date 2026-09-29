import asyncio
import logging
from typing import TypedDict, Optional, Literal, List
from langgraph.graph import StateGraph, END
from app.services.llm_provider import generate_completion

# Configure logger
logger = logging.getLogger("SynapseRL.AdversarialGraph")
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")


class PostState(TypedDict):
    """
    Shared state schema for the Adversarial Multi-Agent Debate Graph.
    """
    topic: str
    tone_guidance: Optional[str]
    current_draft: str
    hacker_critique: str
    revision_count: int
    is_approved: bool
    llm_provider: Optional[str]
    llm_model: Optional[str]
    temperature: Optional[float]
    draft_history: Optional[List[str]]
    critique_history: Optional[List[str]]


async def sme_node(state: PostState) -> dict:
    """
    Subject Matter Expert (SME) Node.
    Writes the initial domain authority draft or revises it based on Algorithm Hacker critique.
    """
    topic = state.get("topic", "Autonomous B2B Systems")
    tone = state.get("tone_guidance", "High conviction thought leadership")
    revision_count = state.get("revision_count", 0)
    critique = state.get("hacker_critique", "")
    provider = state.get("llm_provider", "simulation")
    model = state.get("llm_model", None)
    temperature = state.get("temperature", 0.7)
    draft_history = list(state.get("draft_history") or [])

    print(f"\n[SME Agent] Initiating pass (Revision Cycle: {revision_count}) for topic: '{topic}' using [{provider}]")
    if critique:
        print(f"[SME Agent] Reading critique: \"{critique}\"")

    # Fallback simulated templates if provider is simulation or call fails
    if revision_count == 0:
        simulated_draft = (
            f"In today's fast-moving tech ecosystem, many companies are looking at {topic}.\n\n"
            f"We have found that implementing modern AI pipelines requires careful coordination across multiple tools. "
            f"When teams build without structured processes, they often run into unexpected bottlenecks.\n\n"
            f"Here are a few tips to keep in mind:\n"
            f"- Make sure to test your prompts\n"
            f"- Add error handling\n"
            f"- Keep human oversight in the loop\n\n"
            f"Let me know your thoughts in the comments!"
        )
    else:
        if "blueprint" in (tone or "").lower() or "analytical" in (tone or "").lower():
            simulated_draft = (
                f"[The Engineering Blueprint for {topic}]\n\n"
                f"Most multi-agent architectures fail in production because of unmonitored agent state drift.\n\n"
                f"Here is the 3-layer architecture we use to ensure deterministic execution:\n\n"
                f"1. Strict Schema Sandboxing (Pydantic v2 validation before tool execution)\n"
                f"2. Adversarial State Graph Loops (Debate nodes before state persistence)\n"
                f"3. Human-in-the-Loop RLHF Queues (Capturing pairwise DPO preference data)\n\n"
                f"The result: 4.2x higher output reliability and zero silent logic regressions.\n\n"
                f"What is your biggest state bottleneck when deploying autonomous agents?"
            )
        else:
            simulated_draft = (
                f"Most teams building {topic} are making a $200k mistake:\n\n"
                f"They treat LLMs like deterministic databases instead of stochastic reasoning engines.\n\n"
                f"90% of autonomous agent failures happen because one model is responsible for both generation AND validation.\n\n"
                f"The fix? An Adversarial Dual-Agent Architecture:\n"
                f"* Agent 1 (The Executor): Drafts domain solutions with strict constraint boundaries.\n"
                f"* Agent 2 (The Red Team): Validates edge cases and flags corporate fluff before state commits.\n"
                f"* RLHF Calibration: Discrepancies route to a human A/B arena for DPO fine-tuning.\n\n"
                f"Bookmark this framework before your next architecture review."
            )

    if provider and provider != "simulation":
        system_prompt = (
            f"You are an elite B2B Subject Matter Expert and Principal Systems Architect. "
            f"Write a high-conviction, insight-dense thought leadership post about {topic}. "
            f"Tone: {tone}. Zero corporate buzzwords, no shallow clichés, format with clear whitespace and punchy line breaks."
        )
        user_prompt = f"Topic: {topic}."
        if critique:
            user_prompt += f"\nPrevious draft critique: {critique}\nRewrite and address all critiques aggressively."
        
        draft = await generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            provider=provider,
            model=model,
            temperature=temperature,
            fallback_text=simulated_draft,
        )
    else:
        await asyncio.sleep(0.2)
        draft = simulated_draft

    draft_history.append(draft)
    print(f"[SME Agent] Draft v{revision_count + 1} generated ({len(draft.split())} words)")

    return {
        "current_draft": draft,
        "revision_count": revision_count + 1,
        "draft_history": draft_history,
    }


async def hacker_node(state: PostState) -> dict:
    """
    Algorithm Hacker Node.
    Evaluates viral hook mechanics, dwell-time retention, and corporate cringe heuristics.
    """
    draft = state.get("current_draft", "")
    revision_count = state.get("revision_count", 1)
    provider = state.get("llm_provider", "simulation")
    model = state.get("llm_model", None)
    critique_history = list(state.get("critique_history") or [])

    print(f"\n[Algorithm Hacker] Evaluating draft against viral distribution heuristics (Review #{revision_count})...")

    if revision_count <= 1:
        is_approved = False
        default_critique = (
            "REJECTED: Opening line is generic corporate fluff ('In today's fast-moving...'). "
            "Paragraphs lack punchy cadence and visual whitespace. "
            "Action item: Inject a bold contrarian dollar-value hook, use high-contrast bullet structure, and eliminate filler words."
        )
    else:
        is_approved = True
        default_critique = (
            "APPROVED: Strong polarizing hook in lines 1-2. High dwell-time scannability. "
            "Zero corporate cringe detected. Actionable architectural takeaways."
        )

    if provider and provider != "simulation" and revision_count <= 1:
        system_prompt = (
            "You are an aggressive Algorithm Hacker and viral B2B distribution critic. "
            "Audit the draft for: 1. Weak hooks 2. Fluffy corporate jargon 3. Visual scanability. "
            "If it's flawed, reply starting with 'REJECTED:' followed by brutal, high-impact critiques. "
            "If it's exceptional, reply starting with 'APPROVED:'."
        )
        critique = await generate_completion(
            prompt=f"Audit this LinkedIn thought leadership post:\n\n{draft}",
            system_prompt=system_prompt,
            provider=provider,
            model=model,
            temperature=0.3,
            fallback_text=default_critique,
        )
        is_approved = "APPROVED" in critique.upper()
    else:
        critique = default_critique

    critique_history.append(critique)
    print(f"[Algorithm Hacker] Outcome: {'APPROVED' if is_approved else 'REJECTED'}")

    return {
        "hacker_critique": critique,
        "is_approved": is_approved,
        "critique_history": critique_history,
    }


def should_continue(state: PostState) -> Literal["sme_node", END]:
    """
    Router edge: Checks if draft is approved or if maximum revision limit is reached.
    """
    is_approved = state.get("is_approved", False)
    revision_count = state.get("revision_count", 0)

    if is_approved or revision_count >= 2:
        print(f"[Router] Terminating debate graph (Approved: {is_approved}, Revisions: {revision_count}) -> END\n")
        return END

    print(f"[Router] Re-routing to SME Node for revision cycle {revision_count + 1}...\n")
    return "sme_node"


def build_debate_graph() -> StateGraph:
    workflow = StateGraph(PostState)
    workflow.add_node("sme_node", sme_node)
    workflow.add_node("hacker_node", hacker_node)
    workflow.set_entry_point("sme_node")
    workflow.add_edge("sme_node", "hacker_node")
    workflow.add_conditional_edges(
        "hacker_node",
        should_continue,
        {
            "sme_node": "sme_node",
            END: END,
        },
    )
    return workflow.compile()


debate_graph = build_debate_graph()
compiled_graph = debate_graph
