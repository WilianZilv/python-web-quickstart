from dataclasses import dataclass

from core.services.user_service import UserService
from fastapi import Depends


@dataclass
class UserAuthenticate:

    user_service: UserService = Depends(UserService)

    async def execute(self, email: str | None, username: str | None, password: str):

        user = await self.user_service.ensure_user_exists(
            email=email, username=username
        )

        user.verify_password(password)

        return user
