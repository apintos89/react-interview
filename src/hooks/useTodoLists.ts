import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { todoListsApi } from "../lib/api";
import type { CreateTodoListDto, UpdateTodoListDto } from "../types/todo";

export function useTodoLists() {
  return useQuery({
    queryKey: ["todo-lists"],
    queryFn: todoListsApi.getAll,
  });
}

export function useTodoList(id: number | string) {
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return useQuery({
    queryKey: ["todo-lists", numId],
    queryFn: () => todoListsApi.getOne(numId),
    enabled: !!numId && !isNaN(numId),
  });
}

export function useCreateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoListDto) => todoListsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
  });
}

export function useUpdateTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoListDto }) =>
      todoListsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
  });
}

export function useDeleteTodoList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoListsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo-lists"] });
    },
  });
}
