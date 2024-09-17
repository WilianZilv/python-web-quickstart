"use client";

import { create } from "zustand";

export type Todo = {
  id: number;
  title: string;
  created_at?: string;
  ended_at?: string;
  _pending?: boolean;
};

interface TodoStore {
  data: Todo[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isLoading: () => boolean;
  setPending: () => void;
  setEnded: () => void;
  setData: (data: Todo[]) => void;
  getTodo: (id: number) => Todo | undefined;
  addTodo: (todo: Todo) => void;
  removeTodo: (id: number) => void;
  updateTodo: (todo: Todo, id?: number) => void;
}

export const useTodoStore = create<TodoStore>((set, get, state) => ({
  data: [],
  loading: false,
  setPending: () => set({ loading: true }),
  setEnded: () => set({ loading: false }),
  isLoading: () => get().loading,
  setLoading: (loading) => set({ loading }),
  setData: (data) => set({ data }),
  getTodo: (id) => get().data.find((t) => t.id === id),
  addTodo: (todo) => set(({ data }) => ({ data: [todo, ...data] })),
  removeTodo: (id) =>
    set(({ data }) => ({ data: data.filter((t) => t.id !== id) })),
  updateTodo: (todo, id) =>
    set(({ data }) => ({
      data: data.map((t) =>
        t.id === (id === undefined ? todo.id : id) ? todo : t
      ),
    })),
}));

export const useLoading = async (
  promise: Promise<any>,
  onSuccess?: CallableFunction
) => {
  useTodoStore.getState().setPending();
  try {
    const data = await promise;
    if (onSuccess) await onSuccess();
    return data;
  } catch (error) {
    throw error;
  } finally {
    useTodoStore.getState().setEnded();
  }
};
