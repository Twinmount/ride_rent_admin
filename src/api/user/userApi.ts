import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { UsersResponse } from "@/types/api-types/API-types";

export interface UserParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Fetch all users with pagination and optional search
 */
export const fetchUsers = async (
  params: UserParams = {},
): Promise<UsersResponse> => {
  try {
    // Get base URL from environment variable with fallback
    const baseURL =
      import.meta.env.VITE_USER_API_BASE_URL || "https://dev-api.ride.rent";

    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append("page", params.page.toString());
    }

    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    if (params.search) {
      queryParams.append("search", params.search);
    }

    // Construct the full URL with base URL
    const endpoint = Slug.GET_ALL_USERS;
    const url = queryParams.toString()
      ? `${baseURL}${endpoint}?${queryParams.toString()}`
      : `${baseURL}${endpoint}`;

    const data = await API.get<UsersResponse>({ slug: url });

    if (!data) {
      throw new Error("Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
