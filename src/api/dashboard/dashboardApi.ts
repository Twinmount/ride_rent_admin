import {
  FetchDashboardAnalytics,
  FetchMostViewedVehiclesResponse,
} from "@/types/api-types/API-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";

// fetch all categories
export const fetchAdminDashboard =
  async (): Promise<FetchDashboardAnalytics> => {
    try {
      const data = await API.get<FetchDashboardAnalytics>({
        slug: Slug.GET_ADMIN_DASHBOARD,
      });

      if (!data) {
        throw new Error("Failed to fetch dashboard data");
      }

      return data;
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      throw error;
    }
  };

// fetch most viewed vehicles for dashboard widget
export const fetchMostViewedVehicles = async (
  limit: number = 10,
): Promise<FetchMostViewedVehiclesResponse> => {
  try {
    const data = await API.get<FetchMostViewedVehiclesResponse>({
      slug: `${Slug.GET_POPULAR_VEHICLES}?limit=${limit}`,
    });

    if (!data) {
      throw new Error("Failed to fetch most viewed vehicles");
    }

    return data;
  } catch (error) {
    console.error("Error fetching most viewed vehicles:", error);
    throw error;
  }
};
