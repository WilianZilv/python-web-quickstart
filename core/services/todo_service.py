from dataclasses import dataclass
from typing import cast
from core.entities.todo import Todo
from core.entities.user import User
from core.helpers.exceptions import NotAuthorized, NotFoundError
from core.repositories.todo_repository import TodoRepository
from fastapi import Depends


@dataclass
class TodoService:
    todo_repository: TodoRepository = Depends(TodoRepository)

    async def ensure_todo_ownership(self, user: User, todo: Todo):
        if user.id != todo.user_id:
            raise NotAuthorized

    async def ensure_todo_exists(self, todo_id: int | None):

        todo = None

        if todo_id is not None:
            todo = await self.todo_repository.find_by_id(todo_id)

        if not todo:
            raise NotFoundError

        return todo
