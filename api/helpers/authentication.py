import base64
from dataclasses import dataclass
import json
from typing import Any, cast
from fastapi import Request, Response, Depends
from sqlmodel import SQLModel
from api.helpers.jwt import JWT
from core.entities.user import User
from core.helpers.exceptions import NotAuthorized
from core.services.user_service import UserService


@dataclass
class Authentication:

    reference: str = "user"

    def validate_token(self, request: Request) -> dict[str, Any]:
        try:
            token = cast(str, request.cookies.get(self.reference))

            return cast(dict, JWT.decode(token)[self.reference])

        except Exception:
            raise NotAuthorized()

    def authenticate(self, response: Response, user: User):

        _dict = user.model_dump(exclude={"password"})
        _json = user.model_dump_json(exclude={"password"})

        access_token = JWT.encode({self.reference: _dict})

        _base64 = base64.b64encode(bytes(_json, "utf-8")).decode("utf-8")

        response.set_cookie(key=self.reference, value=access_token)
        response.set_cookie(key=self.reference + "_data", value=_base64)

    async def current_user(
        self, request: Request, user_service: UserService = Depends(UserService)
    ):
        data = self.validate_token(request)
        return await user_service.ensure_user_exists(user_id=data["id"])


auth = Authentication()
