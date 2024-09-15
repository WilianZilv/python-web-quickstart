from dataclasses import dataclass

from core.entities.user import User
from core.helpers.exceptions import (
    EmailAlreadyExists,
    EmailNotFound,
    UsernameAlreadyExists,
    UsernameNotFound,
)
from core.repositories.user_repository import UserRepository
from fastapi import Depends


@dataclass
class UserService:

    user_repository: UserRepository = Depends(UserRepository)

    async def ensure_email_is_unique(self, email: str):

        user = await self.user_repository.find_by_email(email)

        if user:
            raise EmailAlreadyExists
        return user

    async def ensure_username_is_unique(self, username: str):

        user = await self.user_repository.find_by_username(username)

        if user:
            raise UsernameAlreadyExists
        return user

    async def ensure_user_exists(
        self,
        user_id: int | None = None,
        email: str | None = None,
        username: str | None = None,
    ):

        if isinstance(user_id, int):
            user = await self.user_repository.find_by_id(user_id)

            if not user:
                raise UsernameNotFound
            return user

        if isinstance(email, str):
            user = await self.user_repository.find_by_email(email)

            if not user:
                raise EmailNotFound
            return user

        if isinstance(username, str):
            user = await self.user_repository.find_by_username(username)

            if not user:
                raise UsernameNotFound
            return user

        raise Exception
