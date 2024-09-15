from dataclasses import dataclass
from core.entities.todo import NewTodo, TodoFactory
from core.entities.user import User
from core.services.todo_service import TodoService
from fastapi import Depends


@dataclass
class AddTodo:

    todo_service: TodoService = Depends(TodoService)

    async def execute(self, user: User, new_todo: NewTodo):

        todo = TodoFactory.create(new_todo, user)

        return await self.todo_service.todo_repository.save(todo)
