import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { JobStatus } from "../types/todo";
import { todoItemsApi } from "@/lib/api";

interface UseJobPollingOptions {
  listId: string;
  statusUrl: string | null;
  onCompleted?: (result: JobStatus["result"]) => void;
  onFailed?: () => void;
  pollInterval?: number;
  enabled?: boolean;
}

export function useJobPolling({
  listId,
  statusUrl,
  onCompleted,
  onFailed,
  pollInterval = 1000,
  enabled = true,
}: UseJobPollingOptions) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: jobStatus, isError } = useQuery<JobStatus>({
    queryKey: ["job-status", listId, statusUrl],
    queryFn: () => todoItemsApi.getJobStatus(listId, statusUrl!),
    enabled: enabled && !!statusUrl && !isCompleted,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.state === "completed" || data?.state === "failed") {
        return false;
      }
      return pollInterval;
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (!jobStatus) return;

    if (typeof jobStatus.progress === "number") {
      setProgress(jobStatus.progress);
    } else if (jobStatus.progress && typeof jobStatus.progress === "object") {
      const percent =
        (jobStatus.progress.current / jobStatus.progress.total) * 100;
      setProgress(Math.round(percent));
    }

    if (jobStatus.state === "completed" && !isCompleted) {
      setIsCompleted(true);
      setProgress(100);
      onCompleted?.(jobStatus.result);
    }

    if (jobStatus.state === "failed" && !isCompleted) {
      setIsCompleted(true);
      onFailed?.();
    }
  }, [jobStatus, isCompleted, onCompleted, onFailed]);

  useEffect(() => {
    if (isError && !isCompleted) {
      setIsCompleted(true);
      onFailed?.();
    }
  }, [isError, isCompleted, onFailed]);

  const isPolling = enabled && !!statusUrl && !isCompleted;

  return {
    isPolling,
    progress,
    jobStatus,
    isError,
  };
}
