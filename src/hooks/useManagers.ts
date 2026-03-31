import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createManager, deleteManager, fetchManagers, updateManager } from "@/api/manager";
import type { Manager, ManagerFormData } from "@/types/manager-types";

export const MANAGERS_QUERY_KEY = (agentId: string) => ["managers", agentId];

/**
 * Hook to fetch all managers for a given agent.
 */
export const useManagers = (agentId: string | undefined) => {
  return useQuery({
    queryKey: MANAGERS_QUERY_KEY(agentId ?? ""),
    queryFn: () => fetchManagers(agentId!),
    enabled: !!agentId,
    select: (data: any): Manager[] => {
      if (Array.isArray(data?.result)) return data.result;
      if (Array.isArray(data?.result?.result)) return data.result.result;
      return [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to create a new manager, with automatic cache invalidation on success.
 */
export const useCreateManager = (agentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: ManagerFormData) => createManager(agentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY(agentId) });
    },
  });
};

/**
 * Hook to update an existing manager, with automatic cache invalidation on success.
 */
export const useUpdateManager = (agentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ managerId, formData }: { managerId: string; formData: ManagerFormData }) =>
      updateManager(managerId, agentId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY(agentId) });
    },
  });
};

/**
 * Hook to delete a manager (soft-delete), with automatic cache invalidation on success.
 */
export const useDeleteManager = (agentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (managerId: string) => deleteManager(managerId, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGERS_QUERY_KEY(agentId) });
    },
  });
};
