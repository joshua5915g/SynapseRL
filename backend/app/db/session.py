from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

SQLITE_DATABASE_URL = "sqlite:///./rlhf_data.db"
ASYNC_SQLITE_DATABASE_URL = "sqlite+aiosqlite:///./rlhf_data.db"

# Synchronous Engine & Session
engine = create_engine(
    SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Asynchronous Engine & Session
async_engine = create_async_engine(
    ASYNC_SQLITE_DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency for yielding database sessions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    """
    FastAPI dependency for yielding async database sessions.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


def init_sync_db():
    """
    Creates all SQLite tables synchronously.
    """
    Base.metadata.create_all(bind=engine)
