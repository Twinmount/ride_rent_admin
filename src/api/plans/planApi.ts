import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  CreatePlanPayload,
  GetAllPlansParams,
  GetAllPlansResponse,
  GetSinglePlanResponse,
  FetchPlansResponse,
} from "@/types/planTypes";

/**
 * Get all plans with pagination and filters (Public - No Auth Required)
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with plans and pagination data
 */
export const getAllPlans = async (
  params?: GetAllPlansParams
): Promise<GetAllPlansResponse | undefined> => {
  try {
    const queryParameters = {
      page: params?.page || 1,
      limit: params?.limit || 10,
      ...(params?.search && { search: params.search }),
      ...(params?.sortOrder && { sortOrder: params.sortOrder }),
    };

    const response = await API.get<FetchPlansResponse>({
      slug: Slug.GET_ALL_PLANS,
      queryParameters,
    });

    // Transform API response to normalized structure
    if (response?.result) {
      return {
        plans: response.result?.list || [],
        pagination: {
          page: response.result.page,
          limit: response.result.limit,
          total: response.result.total,
          totalNumberOfPages: response.result.totalNumberOfPages,
        },
      };
    }

    return undefined;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

/**
 * Get a single plan by ID (Public - No Auth Required)
 * @param id - Plan UUID
 * @returns Promise with plan data
 */
export const getPlanById = async (
  id: string
): Promise<GetSinglePlanResponse | undefined> => {
  try {
    const data = await API.get<GetSinglePlanResponse>({
      slug: `${Slug.GET_PLAN}/${id}`,
    });

    return data;
  } catch (error) {
    console.error(`Error fetching plan with id ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new plan (Admin/Seller Only - Auth Required)
 * @param payload - Plan data to create
 * @returns Promise with created plan data
 */
export const createPlan = async (
  payload: CreatePlanPayload
): Promise<GetSinglePlanResponse | undefined> => {
  try {
    const data = await API.post<GetSinglePlanResponse>({
      slug: Slug.POST_PLAN,
      body: payload,
    });

    return data;
  } catch (error) {
    console.error("Error creating plan:", error);
    throw error;
  }
};

/**
 * Update an existing plan (Admin/Seller Only - Auth Required)
 * @param id - Plan UUID
 * @param payload - Updated plan data
 * @returns Promise with updated plan data
 */
export const updatePlan = async (
  id: string,
  payload: Partial<CreatePlanPayload>
): Promise<GetSinglePlanResponse | undefined> => {
  try {
    const data = await API.put<GetSinglePlanResponse>({
      slug: `${Slug.PUT_PLAN}/${id}`,
      body: payload,
    });

    return data;
  } catch (error) {
    console.error(`Error updating plan with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a plan (Admin/Seller Only - Auth Required)
 * @param id - Plan UUID
 * @returns Promise with success response
 */
export const deletePlan = async (id: string): Promise<void> => {
  try {
    await API.delete({
      slug: `${Slug.DELETE_PLAN}/${id}`,
    });
  } catch (error) {
    console.error(`Error deleting plan with id ${id}:`, error);
    throw error;
  }
};
