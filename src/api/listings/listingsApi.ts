import { VehicleStatusType } from "@/types/formTypes";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchAllVehiclesResponse,
  FetchVehicleTableListingResponse,
} from "@/types/api-types/vehicleAPI-types";

// fetch all vehicles
export const fetchAllVehicles = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  approvalStatus?: VehicleStatusType;
  search?: string;
  stateId: string;
}): Promise<FetchVehicleTableListingResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      stateId: urlParams.stateId,
    });

    if (urlParams.approvalStatus) {
      queryParams.append("approvalStatus", urlParams.approvalStatus);
    }

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_VEHICLES}?${queryParams}`;

    const data = await API.get<FetchVehicleTableListingResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch vehicles data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

// fetch all vehicles
export const fetchNewOrModifiedVehicles = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  approvalStatus?: VehicleStatusType;
  isModified?: boolean;
  userId?: string;
  newRegistration?: boolean;
  search?: string;
  stateId: string;
}): Promise<FetchAllVehiclesResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      stateId: urlParams.stateId,
    });

    if (urlParams.approvalStatus) {
      queryParams.append("approvalStatus", urlParams.approvalStatus);
    }

    if (urlParams.isModified === true || urlParams.isModified === false) {
      queryParams.append("isModified", urlParams.isModified.toString());
    }

    if (urlParams.userId) {
      queryParams.append("userId", urlParams.userId);
    }

    if (urlParams.newRegistration) {
      queryParams.append(
        "newRegistration",
        urlParams.newRegistration.toString(),
      );
    }

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_NEW_OR_MODIFIED_VEHICLES}?${queryParams}`;

    const data = await API.get<FetchAllVehiclesResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch vehicles data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const enableOrDisableVehicle = async ({
  vehicleId,
  isDisabled,
}: {
  vehicleId: string;
  isDisabled: boolean;
}) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_TOGGLE_VEHICLE_VISIBILITY,
      body: {
        vehicleId,
        isDisabled,
      },
    });

    return data;
  } catch (error) {
    console.error("Error toggling vehicle visibility", error);
    throw error;
  }
};

// update vehicle status
export const updateVehicleStatus = async ({
  vehicleId,
  approvalStatus,
  rejectionReason,
}: {
  vehicleId: string;
  approvalStatus: string;
  rejectionReason?: string;
}) => {
  try {
    // Construct the request body
    const body: {
      vehicleId: string;
      approvalStatus: string;
      rejectionReason?: string;
    } = {
      vehicleId,
      approvalStatus,
    };

    // Add rejectionReason only if the approvalStatus is "REJECTED"
    if (approvalStatus === "REJECTED" && rejectionReason) {
      body.rejectionReason = rejectionReason;
    }

    const data = await API.put({
      slug: Slug.PUT_VEHICLE_STATUS,
      body,
    });

    return data;
  } catch (error) {
    console.error("Error updating vehicle status", error);
    throw error;
  }
};
