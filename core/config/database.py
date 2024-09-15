from dataclasses import dataclass
from typing import Any
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSessionTransaction,
    AsyncSession,
    AsyncEngine,
)
from sqlmodel import select
from fastapi import Depends


@dataclass
class DatabaseConfig:
    URI: str = "postgresql+asyncpg://root:123@localhost:5432/postgres"
    engine: AsyncEngine | None = None

    def __post_init__(self):
        self.engine = create_async_engine(self.URI)
        self.async_session = async_sessionmaker(self.engine)

    async def get_session(self) -> AsyncSession | Any | None:
        async with self.async_session() as session:
            async with session.begin_nested():
                try:
                    yield session
                    await session.commit()
                except Exception as e:
                    await session.rollback()
                    raise e
                finally:
                    await session.close()


db = DatabaseConfig()

session_dependency = Depends(db.get_session)
