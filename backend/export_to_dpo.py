#!/usr/bin/env python3
"""
SynapseRL - DPO Dataset Exporter
Extracts human preference records from SQLite (rlhf_data.db) and exports
them to a Hugging Face TRL formatted Direct Preference Optimization (.jsonl) dataset.
"""

import os
import sqlite3
import json
from pathlib import Path


def find_db_path() -> Path:
    script_dir = Path(__file__).resolve().parent
    possible_paths = [
        script_dir / "rlhf_data.db",
        script_dir.parent / "rlhf_data.db",
        script_dir / "synapserl.db",
        script_dir.parent / "synapserl.db",
    ]
    for p in possible_paths:
        if p.exists():
            return p
    return script_dir / "rlhf_data.db"


def clean_tags(tags_raw: str | None) -> str:
    if not tags_raw:
        return "High conviction thought leadership, authentic engineering perspective"
    try:
        parsed = json.loads(tags_raw)
        if isinstance(parsed, list):
            return ", ".join(str(t) for t in parsed)
        return str(parsed)
    except (json.JSONDecodeError, TypeError):
        return str(tags_raw).strip("[]\"'")


def export_dpo_dataset(
    db_path: Path | None = None,
    output_filename: str = "dpo_training_dataset.jsonl"
) -> Path:
    if db_path is None:
        db_path = find_db_path()

    if not db_path.exists():
        raise FileNotFoundError(
            f"Database file not found at '{db_path}'. Please submit preference votes from the Arena first."
        )

    output_path = db_path.parent / output_filename
    print(f"Connecting to database: {db_path}")

    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('preference_pairs', 'preferencepair', 'pairwise_comparisons');"
    )
    tables = [row[0] for row in cursor.fetchall()]

    if not tables:
        conn.close()
        raise RuntimeError("No preference tables found in database.")

    exported_count = 0

    with open(output_path, "w", encoding="utf-8") as f:
        if "preference_pairs" in tables or "preferencepair" in tables:
            target_table = "preference_pairs" if "preference_pairs" in tables else "preferencepair"
            query = f"SELECT topic, winning_text, losing_text, human_tags FROM {target_table};"
            cursor.execute(query)
            rows = cursor.fetchall()

            for row in rows:
                topic, winning_text, losing_text, human_tags = row
                if not (winning_text and losing_text):
                    continue

                formatted_tags = clean_tags(human_tags)
                prompt = (
                    f"Write a high-conviction B2B thought leadership post about: '{topic}'. "
                    f"Target Tone & Style Guidance: {formatted_tags}."
                )

                dpo_item = {
                    "prompt": prompt,
                    "chosen": winning_text,
                    "rejected": losing_text,
                }
                f.write(json.dumps(dpo_item, ensure_ascii=False) + "\n")
                exported_count += 1

        elif "pairwise_comparisons" in tables:
            cursor.execute(
                "SELECT topic, chosen_content, rejected_content, micro_tags FROM pairwise_comparisons WHERE is_reviewed = 1;"
            )
            rows = cursor.fetchall()
            for row in rows:
                topic, chosen, rejected, micro_tags = row
                if not (chosen and rejected):
                    continue

                formatted_tags = clean_tags(micro_tags)
                prompt = (
                    f"Write a high-conviction B2B thought leadership post about: '{topic}'. "
                    f"Target Tone & Style Guidance: {formatted_tags}."
                )

                dpo_item = {
                    "prompt": prompt,
                    "chosen": chosen,
                    "rejected": rejected,
                }
                f.write(json.dumps(dpo_item, ensure_ascii=False) + "\n")
                exported_count += 1

    conn.close()

    print(f"\n========================================================")
    print(f" DPO Dataset Export Complete!")
    print(f" Total Pairs Exported: {exported_count}")
    print(f" Output File: {output_path}")
    print(f" File Size: {os.path.getsize(output_path)} bytes")
    print(f" Format: Hugging Face TRL compatible (prompt, chosen, rejected)")
    print(f"========================================================\n")

    return output_path


if __name__ == "__main__":
    export_dpo_dataset()
