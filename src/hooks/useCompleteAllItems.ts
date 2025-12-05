import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoItemsApi } from "../lib/api";

export function useCompleteAllItems(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => todoItemsApi.completeAll(listId),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["todo-list-items", listId],
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["todo-list-items", listId],
      });
    },
  });
}
