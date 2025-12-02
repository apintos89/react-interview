import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { CreateListDialog } from "../components/CreateListDialog";
import {
  useTodoLists,
  useDeleteTodoList,
  useUpdateTodoList,
} from "../hooks/useTodoLists";
import type { CreateListFormData } from "../types/todo";
import { useForm } from "react-hook-form";
import { createListSchema } from "../validators/todo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { EmptyList } from "@/components/EmptyList";
import { Loading } from "@/components/Loading";
import { FailedToLoad } from "@/components/FailedToLoad";

export function TodoLists() {
  const [showCreateList, setShowCreateList] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const { data: lists, isLoading, error } = useTodoLists();
  const deleteMutation = useDeleteTodoList();
  const updateMutation = useUpdateTodoList();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    reset,
    trigger,
    getValues,
  } = useForm<CreateListFormData>({
    resolver: zodResolver(createListSchema),
  });

  const handleCardClick = (listId: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or input
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("input")
    ) {
      return;
    }
    navigate(`/list/${listId}`, {
      state: { name: lists?.find((l) => l.id === listId)?.name },
    });
  };

  const handleDeleteList = (listId: string, listName: string) => {
    if (confirm(`Delete "${listName}"? This will also delete all items.`)) {
      deleteMutation.mutate(listId);
    }
  };

  const handleEditList = (listId: string, listName: string) => {
    setEditingListId(listId);
    reset({ name: listName });
  };

  const handleSaveName = async (listId: string) => {
    const isValid = await trigger("name");
    if (isValid) {
      const values = getValues();
      updateMutation.mutate(
        { id: listId, data: values },
        {
          onSuccess: () => {
            setEditingListId(null);
            reset();
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingListId(null);
    reset();
  };

  if (isLoading) {
    <Loading />;
  }

  if (error) {
    <FailedToLoad failedMessage="Failed to load todo lists" />;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header
          title="Todo Lists"
          subtitle="Click on a list to view its items"
          buttonText="New List"
          onButtonClick={setShowCreateList}
        />

        <div className="container mx-auto px-4 py-8">
          {!lists || lists.length === 0 ? (
            <EmptyList
              emptyMessage="No todo lists yet"
              buttonText="Create Your First List"
              onButtonClick={setShowCreateList}
            />
          ) : (
            <div className="space-y-3">
              {lists.map((list) => (
                <Card
                  key={list.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={(e) => handleCardClick(list.id, e)}
                >
                  <CardHeader className="py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {editingListId === list.id ? (
                          <div className="space-y-2">
                            <Input
                              {...register("name")}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSaveName(list.id);
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
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveName(list.id)}
                                disabled={updateMutation.isPending}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={updateMutation.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <CardTitle className="text-xl truncate">
                            {list.name}
                          </CardTitle>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditList(list.id, list.name)}
                          disabled={updateMutation.isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteList(list.id, list.name)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateListDialog
        open={showCreateList}
        onOpenChange={setShowCreateList}
      />
    </>
  );
}
