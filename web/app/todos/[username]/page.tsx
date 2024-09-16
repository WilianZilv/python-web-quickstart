"use client";

import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bookmark,
  CheckCircle2,
  CheckIcon,
  ChevronDown,
  CircleEllipsis,
  Clock,
  Dot,
  Ellipsis,
  Loader,
  Loader2,
  LucideSettings,
  LucideSettings2,
  Pencil,
  PlusCircle,
  Settings,
  Settings2,
  SplineIcon,
  Tag,
  Trash,
  User,
} from "lucide-react";
import {
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
  Dialog,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserData, signOut } from "@/lib/user";
import Profile from "@/components/profile";

export type Todo = {
  id: number;
  title: string;
  created_at?: string;
  ended_at?: string;
  _not_persisted?: boolean;
};

async function devSleep(ms: number) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Todos({
  params: { username },
}: {
  params: { username: string };
}) {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNewTodo, setLoadingNewTodo] = useState(false);

  const user = getUserData();

  const isOwner = username === user?.username;
  const isAuthenticated = user?.username !== undefined;

  useEffect(() => {
    async function fetchData() {
      let res = await fetch(`/api/todos/${username}`);

      if (!res.ok) return redirect("/");

      const data = await res.json();
      setTodos(data);

      setLoading(false);
    }

    fetchData();
  }, []);

  const ignoreInteractions =
    loading ||
    loadingNewTodo ||
    todos === undefined ||
    !isAuthenticated ||
    !isOwner;

  const addTodo = () => {
    async function fetchData() {
      if (!isAuthenticated) return;
      if (!isOwner) return;
      if (!newTodo) return;
      if (ignoreInteractions) return;
      setLoadingNewTodo(true);

      const temporaryId = -Math.floor(Math.random() * 1000);

      const temporaryTodo = {
        id: temporaryId,
        title: newTodo,
        created_at: new Date().toISOString().slice(0, -1),
        _not_persisted: true,
      };

      setNewTodo("");
      setTodos((prev) => [temporaryTodo, ...prev]);

      await devSleep(1000);

      const res = await fetch("/api/todos/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (!res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== temporaryId));
        setLoadingNewTodo(false);
        setNewTodo(newTodo);
        return;
      }

      const todo = await res.json();

      setTodos((prev) => prev.map((t) => (t.id === temporaryId ? todo : t)));
      setLoadingNewTodo(false);
      setNewTodo("");
    }

    fetchData();
  };

  async function updateTodo({
    id,
    toggle,
    title,
  }: {
    id: number;
    toggle?: boolean | undefined;
    title?: string | undefined;
  }) {
    if (ignoreInteractions) return false;

    const todo = todos.find((t) => t.id === id);

    if (!todo) return false;
    setLoadingNewTodo(true);

    const originalEndedAt = todo?.ended_at;
    const newEndedAt = !!todo?.ended_at
      ? undefined
      : new Date().toISOString().slice(0, -1);

    const originalTitle = todo?.title;
    const newTitle = title !== undefined ? title : originalTitle;

    const body: any = {};
    const changes: any = {};

    if (toggle !== undefined) {
      body["toggle"] = toggle;
      changes["ended_at"] = newEndedAt;
    }

    if (title !== undefined) {
      body["title"] = title;
      changes["title"] = newTitle;
    }

    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...changes,
              _not_persisted: true,
            }
          : t
      )
    );
    await devSleep(1000);

    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                ended_at: originalEndedAt,
                title: originalTitle,
                _not_persisted: undefined,
              }
            : t
        )
      );
      setLoadingNewTodo(false);
      return false;
    }

    const updatedTodo = await res.json();

    setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));

    setLoadingNewTodo(false);

    return true;
  }

  const toggleTodo = (id: number) => {
    updateTodo({
      id,
      toggle: true,
    });
  };

  const updateTitle = async (id: number, title: string) => {
    return await updateTodo({
      id,
      title,
    });
  };

  const deleteTodo = async (id: number) => {
    if (ignoreInteractions) return false;

    const todo = todos.find((t) => t.id === id);
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (!todo) return false;

    setLoadingNewTodo(true);

    setTodos((prev) => prev.filter((t) => t.id !== id));

    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setTodos((prev) => [
        ...prev.slice(0, todoIndex),
        todo,
        ...prev.slice(todoIndex + 1),
      ]);
      setLoadingNewTodo(false);
      return false;
    }
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setLoadingNewTodo(false);
    return true;
  };

  return (
    <>
      <div className="flex h-screen w-full max-w-4xl mx-auto justify-center items-center">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>
                {isOwner ? "My todos" : `${username}'s todos`}
              </CardTitle>
              <Profile username={user?.username} isOwner={isOwner} />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {isOwner ? (
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a new todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  />
                  <Button disabled={ignoreInteractions} onClick={addTodo}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ) : null}

              <TodoList
                todos={todos}
                toggleTodo={toggleTodo}
                updateTitle={updateTitle}
                deleteTodo={deleteTodo}
                loading={loading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function NoTodos() {
  return (
    <div className="gap-2 h-[400px] flex flex-col items-center justify-center text-center">
      <Bookmark color="gray" />
      <p className="text-sm text-muted-foreground">No todos found.</p>
    </div>
  );
}

function TodoList({
  todos,
  toggleTodo,
  updateTitle,
  deleteTodo,
  loading,
}: {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  updateTitle: (id: number, title: string) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
  loading?: boolean;
}) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TodoItemSkeleton key={i} />
            ))
          : null}
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            updateTitle={updateTitle}
            deleteTodo={deleteTodo}
          />
        ))}
        {!loading && todos.length === 0 ? <NoTodos /> : null}
      </div>
    </ScrollArea>
  );
}

function TodoItemSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-2 justify-between overflow-auto">
        <div className="flex items-center gap-2 w-full  overflow-auto">
          <Dot className="h-3 w-3" color="gray" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-3 w-3" color="gray" />{" "}
          <Skeleton className="h-5 w-24" />
          <CheckIcon className="h-4 w-4" color="gray" />
          <Skeleton className="h-5 w-24" />
          <Clock className="h-3 w-3" color="gray" />
          <Skeleton className="h-5 w-5" />
        </div>
      </div>
      <div className="border-t border-muted-foreground opacity-25"></div>
    </>
  );
}

function TodoItem({
  todo,
  toggleTodo,
  updateTitle,
  deleteTodo,
}: {
  todo: Todo;
  toggleTodo: (id: number) => void;
  updateTitle: (id: number, title: string) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
}) {
  const [onDelete, setOnDelete] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const newTitleRef = useRef<HTMLInputElement>(null);

  const promptDelete = () => {
    setOnDelete(true);
  };

  const cancelDelete = () => {
    setOnDelete(false);
  };

  const promptEdit = () => {
    setOnEdit(true);
  };

  const cancelEdit = () => {
    setOnEdit(false);
  };

  const confirmEdit = async () => {
    if (newTitleRef.current == null) return;
    setLoading(true);
    const success = await updateTitle(todo.id, newTitleRef.current.value);
    setLoading(false);

    if (success) cancelEdit();
  };

  const confirmDelete = async () => {
    setLoading(true);
    const success = await deleteTodo(todo.id);
    setLoading(false);

    if (success) cancelDelete();
  };

  const created_at = todo?.created_at
    ? new Date(todo.created_at + "Z")
    : undefined;
  const ended_at = todo?.ended_at ? new Date(todo.ended_at + "Z") : undefined;

  let duration = undefined;
  let durationLabel = undefined;

  if (created_at && ended_at) {
    duration = ended_at.getTime() - created_at.getTime();

    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      durationLabel = `${hours}h${minutes % 60 < 10 ? "0" : ""}${
        minutes % 60
      }m`;
    } else if (minutes > 0) {
      durationLabel = `${minutes}m${seconds % 60 < 10 ? "0" : ""}${
        seconds % 60
      }s`;
    } else {
      durationLabel = `${seconds}s`;
    }
  }

  return (
    <>
      <div className="flex justify-between overflow-auto">
        <div className="flex items-center gap-2 w-full  overflow-auto">
          <Dot className="h-2 w-2" color={todo.ended_at ? "green" : "blue"} />
          <p
            onClick={() => toggleTodo(todo.id)}
            className={`hover:cursor-pointer word-break text-sm ${
              !!todo.ended_at ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!!todo._not_persisted} variant="ghost" size="sm">
              {!!todo._not_persisted ? (
                <Loader2 className="w-4 h-4 animate-spin color-green" />
              ) : (
                <Ellipsis className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={promptEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={promptDelete}>
              <Trash className="h-4 w-4 mr-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 relative">
        {created_at ? (
          <div className="absolute left-0 text-xs gap-1 flex items-center">
            <Tag className="h-3 w-3" />
            {created_at.toLocaleString()}
          </div>
        ) : null}
        {ended_at ? (
          <div className="absolute left-[150px] text-xs gap-1 flex items-center">
            <CheckIcon className="h-4 w-4" color="green" />
            {ended_at.toLocaleString()}
          </div>
        ) : null}

        {duration ? (
          <div className="absolute left-[310px] text-xs gap-1 flex items-center">
            <Clock className="h-3 w-3" />
            {durationLabel}
          </div>
        ) : null}
      </div>
      <div className="h-3"></div>
      <div className="border-t border-muted-foreground opacity-25"></div>

      <Dialog open={onDelete} onOpenChange={cancelDelete}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={onEdit} onOpenChange={cancelEdit}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle>Edit Todo</DialogTitle>
          <Label>Title</Label>
          <Input defaultValue={todo.title} ref={newTitleRef} />
          <DialogFooter>
            <Button disabled={loading} onClick={confirmEdit}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
