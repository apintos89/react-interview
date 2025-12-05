import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent } from "../components/ui/card";
import { TodoItemRow } from "../components/TodoItemRow";
import { CreateItemDialog } from "../components/CreateItemDialog";
import { useListItems } from "@/hooks/useTodoItems";
import { Header } from "@/components/Header";
import { EmptyList } from "@/components/EmptyList";
import { Loading } from "@/components/Loading";
import { FailedToLoad } from "@/components/FailedToLoad";
import { CompleteAllButton } from "@/components/CompleteAllButton";
import { useJobPolling } from "@/hooks/useJobPolling";
import { useQueryClient } from "@tanstack/react-query";
import { ActiveJob } from "@/types/todo";

const ACTIVE_JOBS_KEY = "todo-active-jobs";

const getActiveJobs = (): ActiveJob[] => {
  try {
    const stored = localStorage.getItem(ACTIVE_JOBS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveActiveJob = (listId: string, statusUrl: string) => {
  const jobs = getActiveJobs().filter((job) => job.listId !== listId);
  jobs.push({ listId, statusUrl, startedAt: Date.now() });
  localStorage.setItem(ACTIVE_JOBS_KEY, JSON.stringify(jobs));
};

const removeActiveJob = (listId: string) => {
  const jobs = getActiveJobs().filter((job) => job.listId !== listId);
  localStorage.setItem(ACTIVE_JOBS_KEY, JSON.stringify(jobs));
};

export function ListItems() {
  const { listId } = useParams<{ listId: string }>();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [statusUrl, setStatusUrl] = useState<string | null>(null);

  const { data: items, isLoading, error } = useListItems(listId!);

  const pendingCount =
    items?.filter((item) => item.status === "Pending").length || 0;

  // Check for active job on mount
  useEffect(() => {
    const activeJob = getActiveJobs().find((job) => job.listId === listId);
    if (activeJob) {
      // Resume polling if job is less than 5 minutes old
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() - activeJob.startedAt < fiveMinutes) {
        setStatusUrl(activeJob.statusUrl);
      } else {
        removeActiveJob(listId!);
      }
    }
  }, [listId]);

  const { isPolling, progress } = useJobPolling({
    listId: listId!,
    statusUrl,
    enabled: !!statusUrl,
    onCompleted: async (result) => {
      removeActiveJob(listId!);

      await queryClient.invalidateQueries({
        queryKey: ["todo-list-items", listId],
      });

      const completedCount = result?.completed ?? pendingCount;
      toast.success(`Successfully completed ${completedCount} items!`);
      setStatusUrl(null);
    },
    onFailed: async () => {
      removeActiveJob(listId!);

      toast.error("Failed to complete items. Please try again.");

      await queryClient.invalidateQueries({
        queryKey: ["todo-list-items", listId],
      });
      setStatusUrl(null);
    },
  });

  const handleStartJob = (newStatusUrl: string) => {
    saveActiveJob(listId!, newStatusUrl);
    setStatusUrl(newStatusUrl);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !items) {
    <FailedToLoad
      failedMessage="Failed to load items"
      backText="Back to Lists"
      hasBackNavigation={true}
    />;
  }

  const completedCount =
    items?.filter((item) => item.status === "Completed").length || 0;
  const totalCount = items?.length || 0;

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header
          title={state.name}
          subtitle={
            totalCount > 0
              ? `${completedCount} of ${totalCount} completed`
              : null
          }
          buttonText="Add Item"
          onButtonClick={setShowCreateItem}
          hasBackNavigation
          additionalActions={
            items && items.length > 0 ? (
              <CompleteAllButton
                listId={listId!}
                items={items}
                isPolling={isPolling}
                progress={progress}
                onStartJob={handleStartJob}
              />
            ) : null
          }
        />

        {!items || items.length === 0 ? (
          <EmptyList
            emptyMessage="No items yet. Add one to get started!"
            buttonText="Add First Item"
            onButtonClick={setShowCreateItem}
          />
        ) : (
          <div className="container mx-auto px-4 py-8">
            {isPolling && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Completing all items...
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Please wait. Individual item actions are temporarily
                      disabled.
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    {progress}%
                  </div>
                </div>
              </div>
            )}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1">
                  {items.map((item) => (
                    <TodoItemRow
                      key={item.id}
                      item={item}
                      isDisabled={isPolling}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateItemDialog
        listId={listId!}
        open={showCreateItem}
        onOpenChange={setShowCreateItem}
      />
    </>
  );
}
