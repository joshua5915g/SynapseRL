from typing import Dict, Any
from app.agents.state import AgentState


def algorithm_hacker_node(state: AgentState) -> Dict[str, Any]:
    """
    Algorithm Hacker node.
    Evaluates viral hook mechanics, corporate cringe, and readability heuristics.
    """
    draft = state.get("current_draft", "")
    iteration = state.get("iteration_count", 1)
    max_iter = state.get("max_iterations", 2)

    # Heuristic scoring simulation
    lines = draft.strip().split("\n")
    first_line_len = len(lines[0]) if lines else 0
    has_bullets = any("•" in line or line.startswith("1.") for line in lines)
    has_question = "?" in draft

    hook_score = 8.5 if (first_line_len < 90 and not draft.startswith("I am excited")) else 5.0
    cringe_score = 2.0 if ("excited to announce" not in draft.lower() and "thrilled" not in draft.lower()) else 8.5
    clarity_score = 9.0 if has_bullets and has_question else 6.0

    # Determine if revision is required
    needs_revision = (iteration < max_iter) and (hook_score < 8.0 or cringe_score > 4.0)

    feedback = (
        f"Iteration {iteration}: Hook score {hook_score}/10, Cringe score {cringe_score}/10. "
        f"Strengthen the opening contrast and ensure tight bullet rhythm."
    )

    return {
        "critique_feedback": feedback,
        "hook_score": hook_score,
        "cringe_score": cringe_score,
        "clarity_score": clarity_score,
        "needs_revision": needs_revision,
    }
