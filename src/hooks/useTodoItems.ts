import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todoItemsApi } from "../lib/api";
import type { CreateTodoItemDto, UpdateTodoItemDto } from "../types/todo";

export function useListItems(todoListId: string) {
  return useQuery({
    queryKey: ["todo-list-items", todoListId],
    queryFn: () => todoItemsApi.getAll(todoListId),
    enabled: !!todoListId,
  });
}

export function useCreateTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      data,
    }: {
      listId: string;
      data: CreateTodoItemDto;
    }) => todoItemsApi.create(listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-list-items"] });
    },
  });
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      itemId,
      data,
    }: {
      listId: string;
      itemId: string;
      data: UpdateTodoItemDto;
    }) => todoItemsApi.update(listId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-list-items"] });
    },
  });
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      todoItemsApi.delete(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-list-items"] });
    },
  });
}
