import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCreateTodoItem } from "../hooks/useTodoItems";
import { ItemStatus } from "@/constants/todo";

const createItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

type CreateItemFormData = z.infer<typeof createItemSchema>;

interface CreateItemDialogProps {
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateItemDialog({
  listId,
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const createMutation = useCreateTodoItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
  });

  const onSubmit = async (data: CreateItemFormData) => {
    try {
      await createMutation.mutateAsync({
        listId,
        data: {
          title: data.title,
          description: data.description || undefined,
          status: ItemStatus.Pending,
        },
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create item:", error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new task to this list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-title">Title</Label>
              <Input
                id="item-title"
                placeholder="e.g., Buy groceries"
                {...register("title")}
                autoFocus
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-description">Description (optional)</Label>
              <Input
                id="item-description"
                placeholder="e.g., Milk, eggs, bread"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
