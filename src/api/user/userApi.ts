import axios from "axios";
import { Slug } from "../Api-Endpoints";
import { UsersResponse } from "@/types/api-types/API-types";
import { StorageKeys, load } from "@/utils/storage";

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

    // Construct the endpoint path
    const endpoint = Slug.GET_ALL_USERS;
    const url = queryParams.toString()
      ? `${endpoint}?${queryParams.toString()}`
      : endpoint;

    // Get access token for authorization
    const accessToken = load<string>(StorageKeys.ACCESS_TOKEN);

    // Make request directly with axios to avoid baseURL conflicts
    const response = await axios.get<UsersResponse>(url, {
      baseURL: baseURL,
      headers: {
        Accept: "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    if (!response.data) {
      throw new Error("Failed to fetch users");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
