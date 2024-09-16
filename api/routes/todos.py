from fastapi import APIRouter, Depends
from core.entities.todo import Todo, TodoChanges, NewTodo
from core.entities.user import User
from core.usecases.add_todo import AddTodo
from core.usecases.delete_todo import DeleteTodo
from core.usecases.get_todos import GetTodos
from core.usecases.update_todo import UpdateTodo
from api.helpers.authentication import auth

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/{username}")
async def get_todos(
    username: str,
    usecase: GetTodos = Depends(GetTodos),
):
    return await usecase.execute(username)


@router.post("/create")
async def add_todo(
    todo: NewTodo,
    user: User = Depends(auth.current_user),
    usecase: AddTodo = Depends(AddTodo),
):
    return await usecase.execute(user, todo)


@router.patch("/{todo_id}")
async def update_todo(
    todo_id: int,
    changes: TodoChanges,
    user: User = Depends(auth.current_user),
    usecase: UpdateTodo = Depends(UpdateTodo),
):
    return await usecase.execute(user, todo_id, changes)


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    user: User = Depends(auth.current_user),
    usecase: DeleteTodo = Depends(DeleteTodo),
):
    await usecase.execute(user, todo_id)
