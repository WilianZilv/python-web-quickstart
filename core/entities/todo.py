from datetime import datetime
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, DateTime

from core.entities.user import User
from core.helpers.datetime import utc_now
from core.helpers.exceptions import UserNotFound


class Todo(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime | None = None
    ended_at: datetime | None = None
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")

    def change_title(self, new_title: str):
        self.title = new_title
        self.update_updated_at()

    def toggle(self):
        if self.ended_at:
            self.ended_at = None
        else:
            self.ended_at = utc_now()

        self.update_updated_at()

    def update_updated_at(self):
        self.updated_at = utc_now()


class TodoChanges(BaseModel):
    title: str | None = None
    toggle: bool | None = None


class NewTodo(BaseModel):
    title: str


class TodoFactory:

    @staticmethod
    def create(i: "NewTodo", user: "User"):

        if user.id is None:
            raise UserNotFound

        return Todo(**i.model_dump(), user_id=user.id)
