from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.session import init_sync_db
from app.db.database import init_db
from app.api.routes import api_router
from app.api.generate import router as generate_ab_router
from app.api.vote import router as vote_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize SQLite database tables (Base.metadata.create_all)
    init_sync_db()
    await init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous B2B Content Engine with LangGraph Multi-Agent Adversarial Routing and RLHF Persistence",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include dedicated RLHF routers (matches /api/rlhf/generate-ab and /api/rlhf/vote)
app.include_router(vote_router)
app.include_router(generate_ab_router)

# Include standard API V1 router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "adversarial_engine": "ACTIVE",
        "persistence_layer": "SQLITE_READY",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
