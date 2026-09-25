from typing import TypedDict, List, Optional


class AgentState(TypedDict):
    """
    Shared state across the Adversarial Multi-Agent Graph.
    """
    topic: str
    target_audience: str
    iteration_count: int
    max_iterations: int
    
    # Subject Matter Expert outputs
    current_draft: str
    
    # Algorithm Hacker critiques
    critique_feedback: str
    hook_score: float         # 0.0 - 10.0
    cringe_score: float       # 0.0 - 10.0 (lower is better)
    clarity_score: float      # 0.0 - 10.0
    needs_revision: bool
    
    # Final synthesized candidates for A/B testing Arena
    candidate_a: Optional[str]
    candidate_b: Optional[str]
    finalized: bool
