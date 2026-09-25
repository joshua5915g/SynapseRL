from fastapi import APIRouter
from app.api.routes.generate import router as generate_router
from app.api.routes.rlhf import router as rlhf_router
from app.api.routes.publisher import router as publisher_router
from app.api.routes.telemetry import router as telemetry_router

api_router = APIRouter()
api_router.include_router(generate_router)
api_router.include_router(rlhf_router)
api_router.include_router(publisher_router)
api_router.include_router(telemetry_router)
