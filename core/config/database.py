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
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.getenv("DATABASE_URI")

if URI is None:
    raise ValueError("enviroment variable DATABASE_URI is not set")


@dataclass
class DatabaseConfig:
    URI: str
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


db = DatabaseConfig(URI=URI)

session_dependency = Depends(db.get_session)
