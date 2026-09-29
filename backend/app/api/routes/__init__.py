from fastapi import APIRouter
from app.api.routes.generate import router as generate_router
from app.api.routes.rlhf import router as rlhf_router
from app.api.routes.publisher import router as publisher_router
from app.api.routes.telemetry import router as telemetry_router
from app.api.routes.llm import router as llm_router
from app.api.routes.hooks import router as hooks_router
from app.api.routes.personas import router as personas_router
from app.api.routes.linter import router as linter_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.formatter import router as formatter_router
from app.api.routes.carousel import router as carousel_router
from app.api.routes.synthetic_judge import router as synthetic_judge_router

api_router = APIRouter()
api_router.include_router(generate_router)
api_router.include_router(rlhf_router)
api_router.include_router(publisher_router)
api_router.include_router(telemetry_router)
api_router.include_router(llm_router)
api_router.include_router(hooks_router)
api_router.include_router(personas_router)
api_router.include_router(linter_router)
api_router.include_router(analytics_router)
api_router.include_router(formatter_router)
api_router.include_router(carousel_router, prefix="/carousel", tags=["carousel"])
api_router.include_router(synthetic_judge_router, prefix="/rlhf/synthetic", tags=["synthetic-judge"])






