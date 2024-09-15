from pydantic import BaseModel
from sqlmodel import Field, SQLModel
from core.helpers import credentials
from core.helpers.exceptions import InvalidPassword, PasswordsDontMatch


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    first_name: str
    last_name: str | None = Field(default=None)
    username: str
    email: str
    password: str

    def encrypt_password(self):
        self.password = credentials.encrypt(self.password)

    def verify_password(self, password: str):

        if not credentials.verify(password, self.password):
            raise InvalidPassword


class NewUser(BaseModel):
    first_name: str
    last_name: str | None = Field(default=None)
    username: str
    email: str
    password1: str
    password2: str


class UserFactory:

    @staticmethod
    def create(i: "NewUser"):

        if i.password1 != i.password2:
            raise PasswordsDontMatch

        data = i.model_dump()
        del data["password1"]
        del data["password2"]

        user = User(**data, password=i.password1)
        user.encrypt_password()

        return user
