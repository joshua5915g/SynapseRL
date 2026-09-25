import asyncio
import logging
from typing import TypedDict, Optional, Literal
from langgraph.graph import StateGraph, END

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


async def sme_node(state: PostState) -> dict:
    """
    Subject Matter Expert (SME) Node.
    Writes the initial domain authority draft or revises it based on Algorithm Hacker critique.
    """
    topic = state.get("topic", "Autonomous B2B Systems")
    tone = state.get("tone_guidance", "High conviction thought leadership")
    revision_count = state.get("revision_count", 0)
    critique = state.get("hacker_critique", "")

    print(f"\n[SME Agent] Initiating pass (Revision Cycle: {revision_count}) for topic: '{topic}'")
    if critique:
        print(f"[SME Agent] Reading critique: \"{critique}\"")

    # Simulate LLM inference delay
    await asyncio.sleep(0.3)

    if revision_count == 0:
        # Initial First Draft
        draft = (
            f"In today's fast-moving tech ecosystem, many companies are looking at {topic}.\n\n"
            f"We have found that implementing modern AI pipelines requires careful coordination across multiple tools. "
            f"When teams build without structured processes, they often run into unexpected bottlenecks.\n\n"
            f"Here are a few tips to keep in mind:\n"
            f"- Make sure to test your prompts\n"
            f"- Add error handling\n"
            f"- Keep human oversight in the loop\n\n"
            f"Let me know your thoughts in the comments!"
        )
        print(f"[SME Agent] Draft v1 generated (Word count: {len(draft.split())})")
    else:
        # Revised High-Signal Draft responding directly to Hacker critique
        if "blueprint" in (tone or "").lower() or "analytical" in (tone or "").lower():
            draft = (
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
            draft = (
                f"Most teams building {topic} are making a $200k mistake:\n\n"
                f"They treat LLMs like deterministic databases instead of stochastic reasoning engines.\n\n"
                f"90% of autonomous agent failures happen because one model is responsible for both generation AND validation.\n\n"
                f"The fix? An Adversarial Dual-Agent Architecture:\n"
                f"* Agent 1 (The Executor): Drafts domain solutions with strict constraint boundaries.\n"
                f"* Agent 2 (The Red Team): Validates edge cases and flags corporate fluff before state commits.\n"
                f"* RLHF Calibration: Discrepancies route to a human A/B arena for DPO fine-tuning.\n\n"
                f"Bookmark this framework before your next architecture review."
            )
        print(f"[SME Agent] Revised draft v{revision_count + 1} finalized based on critique.")

    return {
        "current_draft": draft,
        "revision_count": revision_count + 1,
    }


async def hacker_node(state: PostState) -> dict:
    """
    Algorithm Hacker Node.
    Evaluates viral hook mechanics, dwell-time retention, and corporate cringe heuristics.
    Simulates rejection on loop 1 and approval on loop 2+.
    """
    draft = state.get("current_draft", "")
    revision_count = state.get("revision_count", 1)

    print(f"\n[Algorithm Hacker] Evaluating draft against viral distribution heuristics (Review #{revision_count})...")
    await asyncio.sleep(0.3)

    # Rejection on loop 1, approval on subsequent loops to demonstrate LangGraph loop routing
    if revision_count <= 1:
        is_approved = False
        critique = (
            "REJECTED: Opening line is generic corporate fluff ('In today's fast-moving...'). "
            "Paragraphs lack punchy cadence and visual whitespace. "
            "Action item: Inject a bold contrarian dollar-value hook, use high-contrast bullet structure, and eliminate filler words."
        )
        print(f"[Algorithm Hacker] [REJECTED] Critique: {critique}")
    else:
        is_approved = True
        critique = (
            "APPROVED: Strong polarizing hook in lines 1-2. High dwell-time scannability. "
            "Zero corporate cringe detected. Actionable architectural takeaways."
        )
        print(f"[Algorithm Hacker] [APPROVED] High dwell-time score.")

    return {
        "hacker_critique": critique,
        "is_approved": is_approved,
    }


def should_continue(state: PostState) -> Literal["sme_node", END]:
    """
    Router edge: Checks if draft is approved or if maximum revision limit is reached.
    """
    is_approved = state.get("is_approved", False)
    revision_count = state.get("revision_count", 0)

    if is_approved or revision_count >= 3:
        print(f"[Router] Terminating debate graph (Approved: {is_approved}, Total Revisions: {revision_count}) -> END\n")
        return END

    print(f"[Router] Re-routing back to SME Node for revision cycle {revision_count + 1}...\n")
    return "sme_node"


def build_debate_graph() -> StateGraph:
    """
    Builds and compiles the Adversarial Multi-Agent StateGraph.
    """
    workflow = StateGraph(PostState)

    # Register Nodes
    workflow.add_node("sme_node", sme_node)
    workflow.add_node("hacker_node", hacker_node)

    # Set Entry Point
    workflow.set_entry_point("sme_node")

    # Define Transitions
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


# Export compiled executable debate graph
debate_graph = build_debate_graph()
compiled_graph = debate_graph  # Backward compatibility alias
