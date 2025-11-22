import { VehicleStatusType } from "@/types/formTypes";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchAllVehiclesResponse,
} from "@/types/api-types/vehicleAPI-types";


export const fetchAllVehiclesV2 = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  approvalStatus?: VehicleStatusType;
  isModified?: boolean;
  userId?: string;
  newRegistration?: boolean;
  search?: string;
  countryId?: string; // Add this
}): Promise<FetchAllVehiclesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.approvalStatus) {
      queryParams.append("approvalStatus", urlParams.approvalStatus);
    }

    if (urlParams.countryId) {
    queryParams.append("countryId", urlParams.countryId);
  }

    if (urlParams.isModified === true || urlParams.isModified === false) {
      queryParams.append("isModified", urlParams.isModified.toString());
    }

    if (urlParams.userId) {
      queryParams.append("userId", urlParams.userId);
    }

    if (urlParams.newRegistration) {
      queryParams.append("newRegistration", urlParams.newRegistration.toString());
    }

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_NEW_MODIFIED_VEHICLES}?${queryParams}`;

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