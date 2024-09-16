from fastapi import APIRouter, FastAPI
from api.helpers.exception_handler import http_exception_handler
from api.routes import todos, users

app = FastAPI()


app.add_exception_handler(Exception, http_exception_handler)

api = APIRouter(prefix="/api")

api.include_router(todos.router)
api.include_router(users.router)

app.include_router(api)
