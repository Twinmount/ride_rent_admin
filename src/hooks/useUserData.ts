import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchUsers, UserParams } from "@/api/user/userApi";
import { UsersResponse, User } from "@/types/api-types/API-types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserParams) =>
    [
      ...userKeys.lists(),
      params.page?.toString() || "1",
      params.limit?.toString() || "20",
      params.search || "",
    ] as const,
};

export interface UseUserDataOptions extends UserParams {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

export interface UseUserDataReturn {
  // Data
  users: User[];
  totalUsers: number;

  // Loading states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;

  // Actions
  refetch: () => void;
}

/**
 * React Query hook for fetching user data
 *
 * @param options - Configuration options for the query
 * @returns User data, loading states, and refetch function
 *
 * @example
 * ```tsx
 * const { users, isLoading, refetch } = useUserData({
 *   page: 1,
 *   limit: 20,
 *   enabled: true,
 * });
 * ```
 */
export const useUserData = (
  options: UseUserDataOptions = {},
): UseUserDataReturn => {
  const {
    page = 1,
    limit = 20,
    search,
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes default
  } = options;

  // Prepare query parameters
  const queryParams: UserParams = {
    page,
    limit,
    search,
  };

  // Fetch users using React Query
  const {
    data,
    isLoading,
    isError,
    error,
    isRefetching,
    refetch,
  }: UseQueryResult<UsersResponse, Error> = useQuery({
    queryKey: userKeys.list(queryParams),
    queryFn: () => fetchUsers(queryParams),
    enabled,
    refetchInterval,
    staleTime,
    refetchOnWindowFocus: true,
  });

  const users = data?.data?.users || [];
  const totalUsers = data?.data?.totalUsers || 0;

  return {
    // Data
    users,
    totalUsers,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Actions
    refetch,
  };
};
