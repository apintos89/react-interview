import * as z from "zod";
import { createListSchema } from "@/validators/todo";

export interface TodoList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  items: TodoItem[];
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  todoListId: string;
}

export interface CreateTodoListDto {
  name: string;
}

export interface UpdateTodoListDto {
  name?: string;
}

export interface CreateTodoItemDto {
  title: string;
  description?: string;
  status: string;
}

export interface UpdateTodoItemDto {
  title?: string;
  description?: string;
  status?: string;
}

export type CreateListFormData = z.infer<typeof createListSchema>;
