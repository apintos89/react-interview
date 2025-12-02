import { useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { TodoItemRow } from "./TodoItemRow";
import { CreateItemDialog } from "./CreateItemDialog";
import { useDeleteTodoList, useUpdateTodoList } from "../hooks/useTodoLists";
import type { CreateListFormData, TodoList } from "../types/todo";
import { useForm } from "react-hook-form";
import { createListSchema } from "../validators/todo";
import { zodResolver } from "@hookform/resolvers/zod";

interface TodoListCardProps {
  list: TodoList;
}

export function TodoListCard({ list }: TodoListCardProps) {
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [isEditingTodoListName, setIsEditingTodoListName] = useState(false);
  const deleteMutation = useDeleteTodoList();
  const updateMutation = useUpdateTodoList();

  const {
    register,
    formState: { errors },
    reset,
    trigger,
    getValues,
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      name: list.name,
    },
  });

  const handleDeleteTodoList = () => {
    if (confirm(`Delete "${list.name}"? This will also delete all items.`)) {
      deleteMutation.mutate(list.id);
    }
  };

  const handleUpdateTodoList = () => {
    setIsEditingTodoListName(true);
  };

  const handleSaveName = async () => {
    const isValid = await trigger("name");

    if (isValid) {
      const values = getValues();
      updateMutation.mutate(
        { id: list.id, data: values },
        {
          onSuccess: () => {
            setIsEditingTodoListName(false);
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    reset({ name: list.name });
    setIsEditingTodoListName(false);
  };

  return (
    <>
      <Card className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex-1">
            {!isEditingTodoListName ? (
              <CardTitle className="text-xl">{list.name}</CardTitle>
            ) : (
              <div className="space-y-2">
                <div className="space-y-1">
                  <Input
                    id="name"
                    {...register("name")}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSaveName();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSaveName}
                    disabled={updateMutation.isPending}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleUpdateTodoList}
            disabled={updateMutation.isPending}
            className="shrink-0 -mt-1"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteTodoList}
            disabled={deleteMutation.isPending}
            className="shrink-0 -mt-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 space-y-1">
          {list.items?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No items yet. Add one to get started!
            </p>
          ) : (
            list.items?.map((item) => <TodoItemRow key={item.id} item={item} />)
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCreateItem(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardFooter>
      </Card>

      <CreateItemDialog
        listId={list.id}
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
      />
    </>
  );
}
