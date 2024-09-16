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

    async def get_session(self) -> AsyncSession | Any | None:

        engine = create_async_engine(self.URI)
        async_session = async_sessionmaker(engine)

        async with async_session() as session:
            async with session.begin():
                try:
                    yield session
                    await session.commit()
                except Exception as e:
                    await session.rollback()
                    raise e


db = DatabaseConfig(URI=URI)

session_dependency = Depends(db.get_session)
