// Fetch rental averages for a vehicle series
export const fetchRentalAverages = async (vehicleSeriesId: string) => {
  try {
    const data = await API.get<any>({
      slug: `/vehicle/series/${vehicleSeriesId}/rental-averages`,
    });
    if (!data) {
      throw new Error("Failed to fetch rental averages");
    }
    return data;
  } catch (error) {
    console.error("Error fetching rental averages:", error);
    throw error;
  }
};
import {
  FetchAllSeriesResponse,
  FetchSpecificSeriesResponse,
  VehicleSeriesSearch,
} from "@/types/api-types/API-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { VehicleSeriesType } from "@/types/types";

// fetch all vehicle series based on the vehicle brand and search term
export const searchVehicleSeries = async (urlParams: {
  vehicleSeries: string;
  brandId: string;
  stateId: string;
}): Promise<VehicleSeriesSearch> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      vehicleSeries: urlParams.vehicleSeries,
      brandId: urlParams.brandId,
      stateId: urlParams.stateId,
    }).toString();

    const slugWithParams = `${Slug.GET_SEARCH_VEHICLE_SERIES}?${queryParams}`;

    const data = await API.get<VehicleSeriesSearch>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch brands data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Add a new vehicle series
export const addVehicleSeries = async (
  seriesData: VehicleSeriesType,
): Promise<VehicleSeriesType> => {
  try {
    const slug = Slug.POST_VEHICLE_SERIES;

    const requestBody = {
      ...seriesData,
    };

    const data = await API.post<VehicleSeriesType>({
      slug,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to add vehicle series");
    }
    return data;
  } catch (error) {
    console.error("Error adding vehicle series:", error);
    throw error;
  }
};

// Update an existing vehicle series
export const updateVehicleSeries = async (
  seriesData: VehicleSeriesType,
  vehicleSeriesId: string,
): Promise<VehicleSeriesType> => {
  try {
    const slug = `${Slug.PUT_VEHICLE_SERIES}`;

    const requestBody = {
      ...seriesData,
      vehicleSeriesId,
    };

    const data = await API.put<VehicleSeriesType>({
      slug,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update vehicle series");
    }
    return data;
  } catch (error) {
    console.error("Error updating vehicle series:", error);
    throw error;
  }
};

// fetch specific brand by ID
export const fetchSeriesById = async (
  vehicleSeriesId: string,
): Promise<FetchSpecificSeriesResponse> => {
  try {
    const data = await API.get<FetchSpecificSeriesResponse>({
      slug: `${Slug.GET_SERIES_BY_ID}?vehicleSeriesId=${vehicleSeriesId}`,
    });
    if (!data) {
      throw new Error("Failed to fetch brand data ");
    }

    return data;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw error;
  }
};

// fetch all brands
export const fetchAllSeries = async (urlParams: {
  page: number;
  brandId?: string;
  stateId: string;
  search: string;
}): Promise<FetchAllSeriesResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: "10",
      sortOrder: "DESC",
      stateId: urlParams.stateId,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    if (urlParams.brandId) {
      queryParams.append("brandId", urlParams.brandId);
    }

    const slugWithParams = `${Slug.GET_ALL_SERIES}?${queryParams.toString()}`;

    const data = await API.get<FetchAllSeriesResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch brands data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};
