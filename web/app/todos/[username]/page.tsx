"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DialogFooter,
  DialogContent,
  DialogDescription,
  Dialog,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Profile from "@/components/profile";
import {
  Bookmark,
  CheckIcon,
  Clock,
  Dot,
  Ellipsis,
  Loader2,
  Pencil,
  PlusCircle,
  Tag,
  Trash,
} from "lucide-react";

import { Fragment, useEffect, useRef, useState } from "react";
import { removeTodo, updateTodo } from "@/core/actions";
import { useTodoStore, Todo, useLoading } from "@/core/store";
import { getUserData } from "@/lib/user";
import { cn, dispatch, durationToString } from "@/lib/utils";

export default function Todos({
  params: { username },
}: {
  params: { username: string };
}) {
  const user = getUserData();

  const isOwner = username === user?.username;
  const isAuthenticated = user?.username !== undefined;

  const { data: todos, loading } = useTodoStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (inputRef.current === null || loading) return;
    const value = inputRef.current.value;
    if (value === "") return;
    inputRef.current.value = "";
    dispatch("addTodo", value);
  };

  useEffect(() => {
    dispatch("loadTodos", username);
  }, []);

  const ignoreInteractions =
    loading || todos === undefined || !isAuthenticated || !isOwner;

  return (
    <>
      <div className="flex h-screen w-full max-w-4xl mx-auto justify-center items-center">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>
                {cn({
                  "My todos": isOwner,
                  [`${username}'s todos`]: !isOwner,
                })}
              </CardTitle>
              <Profile
                username={user?.username}
                isOwner={isOwner}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {isOwner ? (
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Add a new todo..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
                  />
                  <Button disabled={ignoreInteractions} onClick={handleAddTodo}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              ) : null}

              <TodoList />
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

function TodoList() {
  const { data: todos, loading } = useTodoStore();

  const empty = todos === undefined || todos.length === 0;

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {loading && empty ? <TodoItemSkeleton /> : null}
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {!loading && empty ? <NoTodos /> : null}
      </div>
    </ScrollArea>
  );
}

function TodoItemSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Fragment key={i}>
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
    </Fragment>
  ));
}

function TodoItem({ todo }: { todo: Todo }) {
  const [dialog, setDialog] = useState<"delete" | "edit" | "none">("none");

  const closeDialog = () => setDialog("none");
  const openEdit = () => setDialog("edit");
  const openDelete = () => setDialog("delete");

  const onEdit = dialog === "edit";
  const onDelete = dialog === "delete";

  const newTitleRef = useRef<HTMLInputElement>(null);

  const { loading } = useTodoStore();

  const confirmEdit = async () => {
    if (newTitleRef.current == null) return;

    useLoading(updateTodo(todo.id, newTitleRef.current.value), closeDialog);
  };

  const confirmDelete = async () => {
    useLoading(removeTodo(todo.id), closeDialog);
  };

  const created_at = todo?.created_at
    ? new Date(todo.created_at + "Z")
    : undefined;
  const ended_at = todo?.ended_at ? new Date(todo.ended_at + "Z") : undefined;

  const durationText = durationToString(created_at, ended_at);

  const stroke = { "line-through text-muted-foreground": !!todo.ended_at };

  const color = { green: !!todo.ended_at, blue: !todo.ended_at };

  return (
    <>
      <div className="flex justify-between relative">
        {todo._pending ? (
          <Skeleton className="absolute h-full w-full pointer-events-none" />
        ) : null}
        <div
          className="hover:cursor-pointer flex items-center gap-2"
          onClick={() => dispatch("updateTodo", todo.id, undefined, true)}
        >
          <Dot className="h-2 w-2" color={cn(color)} />
          <p
            className={cn(
              "word-break overflow-hidden text-sm w-[20rem] sm:w-[32rem] md:w-[39rem]",
              stroke
            )}
          >
            {todo.title}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!!todo._pending} variant="ghost" size="sm">
              {!!todo._pending ? (
                <Loader2 className="w-4 h-4 animate-spin color-green" />
              ) : (
                <Ellipsis className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={openEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openDelete}>
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

        {durationText ? (
          <div className="absolute left-[310px] text-xs gap-1 flex items-center">
            <Clock className="h-3 w-3" />
            {durationText}
          </div>
        ) : null}
      </div>
      <div className="h-3"></div>
      <div className="border-t border-muted-foreground opacity-25"></div>

      <Dialog open={onDelete} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle>Delete Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this todo?
          </DialogDescription>
          <div className="flex overflow-hidden">
            <Dot />
            <strong className="text-ellipsis w-full overflow-hidden">
              "{todo.title}"
            </strong>
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={confirmDelete}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={onEdit} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Are you sure you want to edit this todo?
          </DialogDescription>
          <div className="flex">
            <Dot />
            <strong className="text-ellipsis w-full overflow-hidden">
              "{todo.title}"
            </strong>
          </div>
          <Label>Title</Label>
          <Input defaultValue={todo.title} ref={newTitleRef} />
          <DialogFooter>
            <Button disabled={loading} onClick={confirmEdit}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
