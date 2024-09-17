"use client";

import { toast } from "sonner";
import { Todo } from "@/core/store";
import { dispatch, onActionResult } from "@/lib/utils";

onActionResult("addTodo", ({ data, error }: { data: Todo; error: any }) => {
  if (error) {
    toast("Error adding todo", {
      important: true,
    });
    return;
  }

  toast("Added todo", {
    description: data.title,
    important: true,
    action: {
      label: "Undo",
      onClick: () => dispatch("removeTodo", data.id),
    },
  });
});

onActionResult(
  "error",
  ({ error }: { error: any }) => {
    console.log(error);
    if (error?.name === "AbortError") return;
    toast(error.message, {
      important: true,
      icon: "❌",
    });
  },
  true
);
