from dataclasses import dataclass
from core.config.database import AsyncSession, db, Depends, select
from core.entities.user import User


@dataclass
class UserRepository:

    session: AsyncSession = Depends(db.get_session)

    async def save(self, user: User):
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def find_by_id(self, id: int):
        return (
            (await self.session.execute(select(User).where(User.id == id)))
            .scalars()
            .first()
        )

    async def find_by_email(self, email: str):
        return (
            (await self.session.execute(select(User).where(User.email == email)))
            .scalars()
            .first()
        )

    async def find_by_username(self, username: str):
        return (
            (await self.session.execute(select(User).where(User.username == username)))
            .scalars()
            .first()
        )
