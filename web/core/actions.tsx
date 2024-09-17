"use client";

import { Todo, useTodoStore } from "@/core/store";
import { safeFetch } from "@/lib/safeFetch";
import { registerAction } from "@/lib/utils";
import { subscribe } from "pubsub-js";

export const loadTodos = registerAction("loadTodos")(
  async (username: string) => {
    const store = useTodoStore.getState();

    const { data, error } = await safeFetch(`/api/todos/${username}`);

    if (error) {
      throw error;
    }
    store.setData(data);
  }
);

export const addTodo = registerAction("addTodo")(async (title: string) => {
  const store = useTodoStore.getState();
  const _id = -Math.random();

  const todo: Todo = {
    id: _id,
    _pending: true,
    title: title,
    created_at: new Date().toISOString().slice(0, -1),
  };

  store.addTodo(todo);

  const { data, error } = await safeFetch("/api/todos/create", "POST", {
    title,
  });

  if (error) {
    store.removeTodo(_id);
    throw error;
  }

  store.updateTodo(data, _id);

  return data;
});

export const updateTodo = registerAction("updateTodo")(
  async (id: number, title?: string, toggle?: boolean) => {
    const store = useTodoStore.getState();
    const currentTodo = store.getTodo(id);

    if (!currentTodo) {
      throw new Error("Todo not found");
    }

    const newEndedAtIfToggle = !!currentTodo.ended_at
      ? undefined
      : new Date().toISOString().slice(0, -1);

    const updatedTodo: Todo = {
      ...currentTodo,
      _pending: true,
      title: title !== undefined ? title : currentTodo.title,
      ended_at: toggle ? newEndedAtIfToggle : currentTodo.ended_at,
    };

    store.updateTodo(updatedTodo);

    const { data, error } = await safeFetch(`/api/todos/${id}`, "PATCH", {
      title,
      toggle,
    });

    if (error) {
      store.updateTodo(currentTodo);
      throw error;
    }

    store.updateTodo(data);

    return data;
  }
);

export const removeTodo = registerAction("removeTodo")(async (id: number) => {
  const store = useTodoStore.getState();
  const currentTodo = store.getTodo(id);

  if (!currentTodo) {
    throw new Error("Todo not found");
  }

  store.updateTodo({ ...currentTodo, _pending: true });

  const { data, error } = await safeFetch(`/api/todos/${id}`, "DELETE");

  if (error) {
    store.updateTodo({ ...currentTodo, _pending: undefined });

    throw error;
  }

  store.removeTodo(id);
  return data;
});
