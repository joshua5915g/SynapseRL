#!/usr/bin/env python3
"""
SynapseRL - Direct Preference Optimization (DPO) Training Pipeline
Fine-tunes open-source LLMs (e.g. Llama-3-8B) on human preference data
using QLoRA (4-bit quantization + LoRA) and Hugging Face TRL DPOTrainer.
"""

import os
import sys
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)
logger = logging.getLogger("SynapseRL.DPOTraining")


def run_dpo_training(
    model_id: str = "meta-llama/Meta-Llama-3-8B-Instruct",
    dataset_path: str = "dpo_training_dataset.jsonl",
    output_dir: str = "adapters/synapse-rl-dpo",
    num_epochs: int = 3,
    beta: float = 0.1,
    learning_rate: float = 5e-5,
    max_length: int = 1024,
    max_prompt_length: int = 512,
):
    """
    Executes DPO fine-tuning using QLoRA 4-bit quantization on a single GPU.
    """
    # Import ML libraries inside function for clean error handling
    try:
        import torch
        from datasets import load_dataset
        from transformers import (
            AutoModelForCausalLM,
            AutoTokenizer,
            BitsAndBytesConfig,
            TrainingArguments,
        )
        from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
        from trl import DPOTrainer, DPOConfig
    except ImportError as e:
        logger.error(
            f"Missing required ML dependencies: {e}\n"
            "Please install the training stack via:\n"
            "pip install torch transformers trl peft datasets bitsandbytes accelerate"
        )
        sys.exit(1)

    # 1. Resolve file paths
    script_dir = Path(__file__).resolve().parent
    resolved_dataset = script_dir / dataset_path if not os.path.isabs(dataset_path) else Path(dataset_path)
    resolved_output = script_dir / output_dir if not os.path.isabs(output_dir) else Path(output_dir)

    if not resolved_dataset.exists():
        logger.error(f"Dataset file not found at: {resolved_dataset}")
        logger.info("Run `python export_to_dpo.py` first to generate the dataset from SQLite.")
        sys.exit(1)

    logger.info(f"Loading DPO dataset from: {resolved_dataset}")
    raw_dataset = load_dataset("json", data_files=str(resolved_dataset))["train"]

    # Split into train/validation subsets (90/10 split if dataset is large enough)
    if len(raw_dataset) > 10:
        split_dataset = raw_dataset.train_test_split(test_size=0.1, seed=42)
        train_dataset = split_dataset["train"]
        eval_dataset = split_dataset["test"]
    else:
        logger.info(f"Small dataset detected ({len(raw_dataset)} pairs). Using full dataset for training.")
        train_dataset = raw_dataset
        eval_dataset = None

    # 2. Check Device & GPU Acceleration
    device_map = "auto"
    use_cuda = torch.cuda.is_available()
    compute_dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16

    if use_cuda:
        gpu_name = torch.cuda.get_device_name(0)
        vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
        logger.info(f"GPU Detected: {gpu_name} ({vram_gb:.1f} GB VRAM)")
    else:
        logger.warning("No CUDA GPU detected. Training will run on CPU with limited performance.")

    # 3. 4-bit Quantization Config (NF4) for VRAM efficiency
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_compute_dtype=compute_dtype,
        bnb_4bit_use_double_quant=True,
    ) if use_cuda else None

    # 4. Load Base Model and Tokenizer
    logger.info(f"Loading Base Model: {model_id}")
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        device_map=device_map,
        torch_dtype=compute_dtype,
        trust_remote_code=True,
    )

    tokenizer = AutoTokenizer.from_pretrained(model_id, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "left"  # Required for batch generation/DPO

    if use_cuda:
        model = prepare_model_for_kbit_training(model)

    # 5. Configure LoRA (Low-Rank Adaptation)
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        lora_dropout=0.05,
        target_modules=[
            "q_proj",
            "k_proj",
            "v_proj",
            "o_proj",
            "gate_proj",
            "up_proj",
            "down_proj",
        ],
        bias="none",
        task_type="CAUSAL_LM",
    )

    # 6. DPO Training Arguments (TRL)
    dpo_args = DPOConfig(
        output_dir=str(resolved_output / "checkpoints"),
        beta=beta,
        learning_rate=learning_rate,
        lr_scheduler_type="cosine",
        num_train_epochs=num_epochs,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        optim="paged_adamw_32bit" if use_cuda else "adamw_torch",
        bf16=torch.cuda.is_bf16_supported(),
        fp16=not torch.cuda.is_bf16_supported() and use_cuda,
        logging_steps=1,
        save_strategy="epoch",
        max_length=max_length,
        max_prompt_length=max_prompt_length,
        remove_unused_columns=False,
        report_to="none",
    )

    # 7. Initialize DPOTrainer
    logger.info("Instantiating TRL DPOTrainer with implicit reward penalty beta=%.2f...", beta)
    trainer = DPOTrainer(
        model=model,
        ref_model=None,  # TRL automatically creates a frozen reference copy from base model
        args=dpo_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        tokenizer=tokenizer,
        peft_config=lora_config,
    )

    # 8. Execute Training Loop
    logger.info("Starting DPO training optimization loop...")
    trainer.train()

    # 9. Save Final LoRA Adapter & Tokenizer
    logger.info(f"Saving fine-tuned LoRA adapter weights to: {resolved_output}")
    resolved_output.mkdir(parents=True, exist_ok=True)
    trainer.model.save_pretrained(str(resolved_output))
    tokenizer.save_pretrained(str(resolved_output))

    logger.info("========================================================")
    logger.info(" DPO Fine-Tuning Successfully Completed!")
    logger.info(f" Saved Adapter: {resolved_output}")
    logger.info(" You can now serve or merge this adapter for inference.")
    logger.info("========================================================")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="SynapseRL - DPO Model Fine-Tuning Pipeline")
    parser.add_argument("--model", type=str, default="meta-llama/Meta-Llama-3-8B-Instruct", help="Hugging Face base model ID")
    parser.add_argument("--dataset", type=str, default="dpo_training_dataset.jsonl", help="Path to exported DPO .jsonl dataset")
    parser.add_argument("--output", type=str, default="adapters/synapse-rl-dpo", help="Output directory for LoRA adapter")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--beta", type=float, default=0.1, help="DPO temperature / divergence penalty parameter")
    parser.add_argument("--lr", type=float, default=5e-5, help="Learning rate")

    args = parser.parse_args()

    run_dpo_training(
        model_id=args.model,
        dataset_path=args.dataset,
        output_dir=args.output,
        num_epochs=args.epochs,
        beta=args.beta,
        learning_rate=args.lr,
    )
