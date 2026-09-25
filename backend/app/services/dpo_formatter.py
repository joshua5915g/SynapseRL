from typing import List, Dict, Any
from app.db.models import PairwiseComparison


class DPOFormatterService:
    """
    Serializes human preference records into standard DPO (Direct Preference Optimization)
    training format for fine-tuning open-source LLMs (Llama 3, Mistral, Gemma).
    """

    @staticmethod
    def format_comparisons_for_dpo(pairs: List[PairwiseComparison]) -> List[Dict[str, Any]]:
        dpo_dataset = []
        for pair in pairs:
            if not pair.chosen_content or not pair.rejected_content:
                continue

            prompt = (
                f"Topic: {pair.topic}\n"
                f"Audience: {pair.target_audience}\n"
                f"Task: Write a high-engagement B2B thought leadership post with zero fluff."
            )

            dpo_dataset.append({
                "pair_id": pair.id,
                "prompt": prompt,
                "chosen": pair.chosen_content,
                "rejected": pair.rejected_content,
                "micro_tags": pair.micro_tags or [],
            })

        return dpo_dataset
