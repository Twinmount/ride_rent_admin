import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  VehicleBucketSearchResponse,
  FetchSpecificVehicleBucketResponse,
  VehicleBucketType,
  FetchVehicleBucketListResponse,
} from "@/types/api-types/API-types";

export interface LinkType {
  label: string;
  link: string;
}

export const searchVehicles = async (query: string, stateId?: string) => {
  try {
    const queryParams = new URLSearchParams({
      query,
    });
    if (stateId) {
      queryParams.append("stateId", stateId);
    }

    const data = await API.get<VehicleBucketSearchResponse>({
      slug: `${Slug.GET_VEHICLE_LIST_FOR_VEHICLE_BUCKET}?${queryParams.toString()}`,
    });
    return data;
  } catch (error) {
    console.error("Error searching vehicles:", error);
    throw error;
  }
};

// add link
export const addVehicleBucket = async (
  values: VehicleBucketType,
): Promise<FetchSpecificVehicleBucketResponse> => {
  try {
    const requestBody = {
      ...values,
    };

    // Send the FormData object using the API post method
    const data = await API.post<FetchSpecificVehicleBucketResponse>({
      slug: Slug.ADD_VEHICLE_BUCKET,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to add vehicle bucket");
    }

    return data;
  } catch (error) {
    console.error("Error adding related links:", error);
    throw error;
  }
};

export const updateVehicleBucket = async (
  vehicleBucketId: string,
  values: VehicleBucketType,
): Promise<FetchSpecificVehicleBucketResponse> => {
  try {
    const requestBody = {
      ...values,
      vehicleBucketId,
    };

    // Send the FormData object using the API put method
    const data = await API.put<FetchSpecificVehicleBucketResponse>({
      slug: `${Slug.PUT_VEHICLE_BUCKET}/${vehicleBucketId}`,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to update vehicle bucket");
    }

    return data;
  } catch (error) {
    console.error("Error updating related links:", error);
    throw error;
  }
};

export const fetchVehicleBucketById = async (
  vehicleBucketId: string,
): Promise<FetchSpecificVehicleBucketResponse> => {
  try {
    const data = await API.get<FetchSpecificVehicleBucketResponse>({
      slug: `${Slug.GET_VEHICLE_BUCKET}/${vehicleBucketId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch vehicle bucket data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vehicle bucket:", error);
    throw error;
  }
};

// fetch all Links
export const fetchAllVehicleBucket = async (urlParams: {
  page: number;
  search: string;
  state: string;
  displayGroup?: string;
  vehicleBucketMode?: string;
}): Promise<FetchVehicleBucketListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: "20",
      sortOrder: "desc",
      state: urlParams.state,
    });

    if (
      urlParams.displayGroup &&
      urlParams.displayGroup?.toLowerCase() !== "all"
    ) {
      queryParams.append("displayGroup", urlParams.displayGroup);
    }

    if (
      urlParams.vehicleBucketMode &&
      urlParams.vehicleBucketMode?.toLowerCase() !== "all"
    ) {
      queryParams.append("vehicleBucketMode", urlParams.vehicleBucketMode);
    }

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_VEHICLE_BUCKET_LIST}?${queryParams.toString()}`;

    const data = await API.get<FetchVehicleBucketListResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch vehicle bucket data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching vehicle bucket:", error);
    throw error;
  }
};

// delete specific link by ID
export const deleteVehicleBucket = async (vehicleBucketId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_VEHICLE_BUCKET}?vehicleBucketId=${vehicleBucketId}`,
    });
    return data;
  } catch (error) {
    console.error("Error deleting vehicle bucket:", error);
    throw error;
  }
};
