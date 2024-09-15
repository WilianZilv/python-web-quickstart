from dataclasses import dataclass
from core.entities.user import User
from core.services.todo_service import TodoService
from fastapi import Depends


@dataclass
class DeleteTodo:

    todo_service: TodoService = Depends(TodoService)

    async def execute(self, user: User, todo_id: int):

        todo = await self.todo_service.ensure_todo_exists(todo_id)

        await self.todo_service.ensure_todo_ownership(user, todo)

        return await self.todo_service.todo_repository.delete(todo)
