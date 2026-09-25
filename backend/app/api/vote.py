import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import PreferencePair
from app.models.schemas import VoteRequest, VoteResponse

router = APIRouter(tags=["RLHF Persistence Engine"])


@router.post("/api/rlhf/vote", response_model=VoteResponse)
def record_rlhf_vote(
    payload: VoteRequest,
    db: Session = Depends(get_db),
):
    """
    Records a human preference decision into the SQLite RLHF persistence layer.
    Saves winning and losing drafts with human micro-tags for downstream DPO dataset export.
    """
    try:
        # Serialize list of tags to JSON string
        tags_json = json.dumps(payload.tags)

        # Instantiate PreferencePair ORM model
        pair = PreferencePair(
            topic=payload.topic,
            winning_text=payload.winning_text,
            losing_text=payload.losing_text,
            human_tags=tags_json,
        )

        # Persist to database
        db.add(pair)
        db.commit()
        db.refresh(pair)

        print(f"\n[Persistence Layer] Stored PreferencePair (ID: {pair.id}) for topic: '{pair.topic}'")
        print(f"[Tags Recorded] {payload.tags}")

        return VoteResponse(
            status="success",
            id=pair.id,
            message="Human preference pair successfully persisted for DPO training.",
        )
    except Exception as e:
        db.rollback()
        print(f"[Persistence Layer Error] Failed to persist vote: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database persistence failed: {str(e)}",
        )
