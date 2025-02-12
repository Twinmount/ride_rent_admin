import { VehicleSeriesSearch } from "@/types/api-types/API-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { VehicleSeriesType } from "@/types/types";

// fetch all vehicle series based on the vehicle brand and search term
export const searchVehicleSeries = async (urlParams: {
  vehicleSeries: string;
  brandId: string;
}): Promise<VehicleSeriesSearch> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      vehicleSeries: urlParams.vehicleSeries,
      brandId: urlParams.brandId,
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
  brandId: string,
): Promise<VehicleSeriesType> => {
  try {
    const slug = Slug.POST_VEHICLE_SERIES;

    const requestBody = {
      ...seriesData,
      brandId,
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
