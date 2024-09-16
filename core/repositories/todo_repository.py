from dataclasses import dataclass
from sqlmodel import desc
from core.entities.todo import Todo
from core.config.database import AsyncSession, db, Depends, select


@dataclass
class TodoRepository:

    session: AsyncSession = Depends(db.get_session)

    async def save(self, todo: Todo):
        self.session.add(todo)
        await self.session.flush()
        await self.session.refresh(todo)
        return todo

    async def delete(self, todo: Todo):
        await self.session.delete(todo)

    async def find_by_id(self, todo_id: int):
        return (
            (await self.session.execute(select(Todo).where(Todo.id == todo_id)))
            .scalars()
            .first()
        )

    async def find_all(self):
        return (await self.session.execute(select(Todo))).scalars().all()

    async def find_all_todos_by_user_id(self, user_id: int):
        return (
            (
                await self.session.execute(
                    select(Todo).where(Todo.user_id == user_id).order_by(desc("id"))
                )
            )
            .scalars()
            .all()
        )
