from dataclasses import dataclass

from core.entities.user import NewUser, User, UserFactory
from core.services.user_service import UserService
from fastapi import Depends


@dataclass
class UserCreateAccount:

    user_service: UserService = Depends(UserService)

    async def execute(self, new_user: NewUser):

        await self.user_service.ensure_email_is_unique(new_user.email)
        await self.user_service.ensure_username_is_unique(new_user.username)

        user = UserFactory.create(new_user)

        return await self.user_service.user_repository.save(user)
