import { Trash2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useDeleteTodoItem, useUpdateTodoItem } from "../hooks/useTodoItems";
import type { TodoItem } from "../types/todo";
import { cn } from "../lib/utils";

interface TodoItemRowProps {
  item: TodoItem;
  isDisabled?: boolean;
}

export function TodoItemRow({ item, isDisabled = false }: TodoItemRowProps) {
  const updateMutation = useUpdateTodoItem();
  const deleteMutation = useDeleteTodoItem();

  const handleToggle = () => {
    if (isDisabled) return;
    updateMutation.mutate({
      listId: item.todoListId,
      itemId: item.id,
      data: { status: item.status === "Pending" ? "Completed" : "Pending" },
    });
  };

  const handleDelete = () => {
    if (isDisabled) return;
    deleteMutation.mutate({ listId: item.todoListId, itemId: item.id });
  };

  const isItemDisabled =
    isDisabled || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors",
        isDisabled && "opacity-50 pointer-events-none"
      )}
    >
      <Checkbox
        checked={item.status === "Completed"}
        onCheckedChange={handleToggle}
        disabled={isItemDisabled}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium wrap-break-words",
            item.status === "Completed" && "line-through text-muted-foreground"
          )}
        >
          {item.title}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 wrap-break-words">
            {item.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isItemDisabled}
        className="shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
