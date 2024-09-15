from dataclasses import dataclass
from typing import cast

from core.services.todo_service import TodoService, Depends
from core.services.user_service import UserService


@dataclass
class GetTodos:

    user_service: UserService = Depends(UserService)
    todo_service: TodoService = Depends(TodoService)

    async def execute(self, username: str):
        user = await self.user_service.ensure_user_exists(username=username)
        return await self.todo_service.todo_repository.find_all_todos_by_user_id(
            user_id=cast(int, user.id)
        )
