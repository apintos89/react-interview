import type {
  TodoList,
  TodoItem,
  CreateTodoListDto,
  UpdateTodoListDto,
  CreateTodoItemDto,
  UpdateTodoItemDto,
} from "../types/todo";

const API_BASE = "http://localhost:3000/api";

// Todo Lists API
export const todoListsApi = {
  getAll: async (): Promise<TodoList[]> => {
    const res = await fetch(`${API_BASE}/todoLists`);
    if (!res.ok) throw new Error("Failed to fetch lists");
    return res.json();
  },

  getOne: async (id: number): Promise<TodoList> => {
    const res = await fetch(`${API_BASE}/todoLists/${id}`);
    if (!res.ok) throw new Error("Failed to fetch list");
    return res.json();
  },

  create: async (data: CreateTodoListDto): Promise<TodoList> => {
    const res = await fetch(`${API_BASE}/todoLists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create list");
    return res.json();
  },

  update: async (id: string, data: UpdateTodoListDto): Promise<TodoList> => {
    const res = await fetch(`${API_BASE}/todoLists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update list");
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/todoLists/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete list");
  },
};

// Todo Items API
export const todoItemsApi = {
  getAll: async (listId: string): Promise<TodoItem[]> => {
    const res = await fetch(`${API_BASE}/todoLists/${listId}/items`);
    if (!res.ok) throw new Error("Failed to fetch items");
    return res.json();
  },

  create: async (
    listId: string,
    data: CreateTodoItemDto
  ): Promise<TodoItem> => {
    const res = await fetch(`${API_BASE}/todoLists/${listId}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create item");
    return res.json();
  },

  update: async (
    listId: string,
    itemId: string,
    data: UpdateTodoItemDto
  ): Promise<TodoItem> => {
    const res = await fetch(`${API_BASE}/todoLists/${listId}/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update item");
    return res.json();
  },

  delete: async (listId: string, itemId: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/todoLists/${listId}/items/${itemId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete item");
  },
};
