from dataclasses import dataclass

from core.entities.todo import TodoChanges
from core.entities.user import User
from core.services.todo_service import TodoService
from fastapi import Depends


@dataclass
class UpdateTodo:

    todo_service: TodoService = Depends(TodoService)

    async def execute(self, user: User, todo_id: int, changes: TodoChanges):

        todo = await self.todo_service.ensure_todo_exists(todo_id)
        await self.todo_service.ensure_todo_ownership(user, todo)

        if changes.title is not None:
            todo.change_title(changes.title)

        if changes.toggle:
            todo.toggle()

        return await self.todo_service.todo_repository.save(todo)
