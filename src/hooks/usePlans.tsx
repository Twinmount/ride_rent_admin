import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan } from "@/api/plans";
import {
    Plan,
    GetAllPlansParams,
    CreatePlanPayload,
    CompanyTireType,
} from "@/types/planTypes";

/**
 * Custom hook for fetching and managing plans list using TanStack Query
 * @param params - Query parameters for filtering and pagination
 * @returns Plans data, loading state, error, and refetch function
 */
export const usePlans = (params: GetAllPlansParams) => {
    const { page = 1, limit = 10, search = "", sortOrder = "ASC" } = params;

    return useQuery({
        queryKey: ["plans", page, limit, search, sortOrder],
        queryFn: () => getAllPlans({ page, limit, search, sortOrder }),
        select: (data) => ({
            plans: data?.plans || [],
            pagination: data?.pagination || null,
        }),
    });
};

/**
 * Custom hook for fetching a single plan by ID using TanStack Query
 * @param planId - Plan UUID
 * @returns Plan data, loading state, error, and refetch function
 */
export const usePlan = (planId: string) => {
    return useQuery({
        queryKey: ["plan", planId],
        queryFn: () => getPlanById(planId),
        enabled: !!planId,
        select: (data) => data?.result || null,
    });
};

/**
 * Custom hook for plan mutations (create, update, delete) using TanStack Query
 * Requires Admin/Seller authentication
 * @returns Mutation functions and their states
 */
export const usePlanMutations = () => {
    const queryClient = useQueryClient();

    const createPlanMutation = useMutation({
        mutationFn: (payload: CreatePlanPayload) => createPlan(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    const updatePlanMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreatePlanPayload> }) =>
            updatePlan(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
            queryClient.invalidateQueries({ queryKey: ["plan"] });
        },
    });

    const deletePlanMutation = useMutation({
        mutationFn: (id: string) => deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["plans"] });
        },
    });

    return {
        createPlanMutation,
        updatePlanMutation,
        deletePlanMutation,
        loading: createPlanMutation.isPending || updatePlanMutation.isPending || deletePlanMutation.isPending,
        error: createPlanMutation.error || updatePlanMutation.error || deletePlanMutation.error,
    };
};

/**
 * Utility function to filter plans based on company tier type
 * @param plans - Array of plans
 * @param companyTireType - Company tier type (0=T1, 1=T2, 2=T3)
 * @returns Filtered array of plans
 */
export const filterPlansByTier = (
    plans: Plan[],
    companyTireType: CompanyTireType
): Plan[] => {
    return plans
        .filter((plan) => !plan.isHidden)
        .filter((plan) => {
            switch (companyTireType) {
                case CompanyTireType.TIER_1:
                    return !!plan.T1;
                case CompanyTireType.TIER_2:
                    return !!plan.T2;
                case CompanyTireType.TIER_3:
                    return !!plan.T3;
                default:
                    return false;
            }
        });
};

/**
 * Utility function to get visible plans (not hidden)
 * @param plans - Array of plans
 * @returns Filtered array of visible plans
 */
export const getVisiblePlans = (plans: Plan[]): Plan[] => {
    return plans.filter((plan) => !plan.isHidden);
};
