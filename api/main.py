from fastapi import FastAPI
from api.helpers.exception_handler import (
    http_exception_handler,
    http_custom_exception_handler,
)
from api.routes import todos, users
from core.helpers.exceptions import CustomException

app = FastAPI(
    exception_handlers={
        Exception: http_exception_handler,
        CustomException: http_custom_exception_handler,
    }
)

app.include_router(todos.router)
app.include_router(users.router)
