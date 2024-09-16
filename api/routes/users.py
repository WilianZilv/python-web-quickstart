from fastapi import APIRouter, Depends, Response
from pydantic import BaseModel

from api.helpers.authentication import auth
from core.entities.user import NewUser, User
from core.usecases.user_authenticate import UserAuthenticate
from core.usecases.user_create_account import UserCreateAccount
from core.config.database import db, AsyncSession


router = APIRouter(prefix="/users", tags=["users"])


class AuthenticateDTO(BaseModel):
    email_or_username: str
    password: str


@router.post("/authenticate")
async def authenticate(
    response: Response,
    dto: AuthenticateDTO,
    usecase: UserAuthenticate = Depends(UserAuthenticate),
):

    email, username = (
        (dto.email_or_username, None)
        if "@" in dto.email_or_username
        else (None, dto.email_or_username)
    )

    user = await usecase.execute(email=email, username=username, password=dto.password)

    auth.authenticate(response, user)


@router.post("/create_account")
async def create_account(
    response: Response,
    new_user: NewUser,
    usecase: UserCreateAccount = Depends(UserCreateAccount),
):
    user = await usecase.execute(new_user)
    auth.authenticate(response, user)


@router.get("/sign_out")
async def sign_out():
    response = Response(status_code=200)
    response.delete_cookie(key="user")
    response.delete_cookie(key="user_data")
    return response
