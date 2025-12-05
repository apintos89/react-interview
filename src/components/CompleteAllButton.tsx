import { CheckCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import type { TodoItem } from "../types/todo";
import { useCompleteAllItems } from "@/hooks/useCompleteAllItems";

interface CompleteAllButtonProps {
  listId: string;
  items: TodoItem[];
  isPolling: boolean;
  progress: number;
  onStartJob: (statusUrl: string) => void;
}

export function CompleteAllButton({
  listId,
  items,
  isPolling,
  progress,
  onStartJob,
}: CompleteAllButtonProps) {
  const completeAllMutation = useCompleteAllItems(listId);

  const pendingCount = items.filter((item) => item.status === "Pending").length;

  if (pendingCount === 0) {
    return null;
  }

  const handleCompleteAll = async () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-medium">Complete all items?</p>
            <p className="text-sm text-muted-foreground mt-1">
              This will complete all {pendingCount} pending items.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await completeAllMutation.mutateAsync();
                  onStartJob(response.statusUrl);
                } catch (error) {
                  console.error("Error completing all items:", error);
                  toast.error("Failed to start completion process");
                }
              }}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      }
    );
  };

  const isDisabled = completeAllMutation.isPending || isPolling;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCompleteAll}
      disabled={isDisabled}
    >
      {isPolling ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Completing... {progress}%
        </>
      ) : (
        <>
          <CheckCheck className="h-4 w-4 mr-2" />
          Complete All ({pendingCount})
        </>
      )}
    </Button>
  );
}
