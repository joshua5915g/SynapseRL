"""
FastAPI Routes for Knowledge Vault & Brand Voice DNA Ingestion.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from app.services.knowledge_vault import vault_service

router = APIRouter(prefix="/vault", tags=["Knowledge Vault"])


class DocumentIngestRequest(BaseModel):
    title: str = Field(..., description="Document or post title")
    content: str = Field(..., description="Full text, transcript, or past post")
    doc_type: str = Field("notes", description="Type: viral_post, podcast_transcript, whitepaper, notes")
    tags: Optional[List[str]] = Field(default_factory=list, description="Categorization tags")


class RAGQueryRequest(BaseModel):
    topic: str = Field(..., description="Target generation topic to retrieve brand context for")
    max_results: int = Field(2, ge=1, le=5)


@router.get("/documents")
async def get_documents():
    """Returns all ingested brand documents and their extracted linguistic style vectors."""
    docs = vault_service.list_documents()
    return {"status": "success", "count": len(docs), "documents": docs}


@router.post("/ingest")
async def ingest_document(payload: DocumentIngestRequest):
    """Ingest a new text asset, extract style cadence & save to the vault."""
    if not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    doc = vault_service.ingest_document(
        title=payload.title,
        content=payload.content,
        doc_type=payload.doc_type,
        tags=payload.tags
    )
    return {"status": "success", "message": "Document ingested and style DNA indexed", "document": doc}


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from the vault."""
    success = vault_service.delete_document(doc_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"status": "success", "message": f"Document {doc_id} deleted"}


@router.post("/rag/context")
async def query_rag_context(payload: RAGQueryRequest):
    """Retrieve brand voice guidelines and relevant knowledge snippets for a target topic."""
    context = vault_service.query_rag_context(payload.topic, payload.max_results)
    return {"status": "success", "data": context}
