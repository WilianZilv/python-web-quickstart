from fastapi import FastAPI
from api.helpers.exception_handler import http_exception_handler
from api.routes import todos, users

app = FastAPI()

app.add_exception_handler(Exception, http_exception_handler)

app.include_router(todos.router)
app.include_router(users.router)
