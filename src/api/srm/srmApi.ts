import {
  AddSRMCustomerFormResponse,
  FetchAllSRMActiveTripsResponse,
  FetchAllSRMAgentsResponse,
  FetchAllSRMCompletedTripsResponse,
  FetchAllSRMCustomersResponse,
  GetSRMCustomerDetailsResponse,
} from "@/types/api-types/srm-api.types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { SRMCustomerDetailsFormType } from "@/types/formTypes";

export const fetchAllSRMActiveTrips = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchAllSRMActiveTripsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_SRM_ACTIVE_TRIPS}?${queryParams}`;

    const data = await API.get<FetchAllSRMActiveTripsResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch srm active trips data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching srm active trips:", error);
    throw error;
  }
};

export const fetchAllSRMCompletedTrips = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchAllSRMCompletedTripsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_SRM_COMPLETED_TRIPS}?${queryParams}`;

    const data = await API.get<FetchAllSRMCompletedTripsResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch srm completed trips data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching srm completed trips:", error);
    throw error;
  }
};

export const fetchAllSRMAgents = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchAllSRMAgentsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_SRM_AGENTS}?${queryParams}`;

    const data = await API.get<FetchAllSRMAgentsResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch srm agents data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching srm agents:", error);
    throw error;
  }
};

export const fetchAllSRMCustomers = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchAllSRMCustomersResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const slugWithParams = `${Slug.GET_ALL_SRM_CUSTOMERS}?${queryParams}`;

    const data = await API.get<FetchAllSRMCustomersResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch customers data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/*
 * API function to create a new customer
 */
export const createSRMCustomer = async (
  values: SRMCustomerDetailsFormType,
  countryCode: string,
): Promise<AddSRMCustomerFormResponse> => {
  try {
    // Extracting phone number and removing country code
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the API
    const requestBody = {
      countryCode,
      customerName: values.customerName,
      email: values.email,
      nationality: values.nationality,
      passportNumber: values.passportNumber,
      passport: values.passport,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      drivingLicense: values.drivingLicense,
      customerProfilePic: values.customerProfilePic || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.post<AddSRMCustomerFormResponse>({
      slug: Slug.POST_SRM_CUSTOMER,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to post customer registration response");
    }

    return data;
  } catch (error) {
    console.error("Error on customer registration", error);
    throw error;
  }
};

export const updateSRMCustomer = async (
  values: SRMCustomerDetailsFormType,
  countryCode: string,
): Promise<AddSRMCustomerFormResponse> => {
  try {
    // Extracting phone number and removing country code
    const phoneNumber = values.phoneNumber
      .replace(`+${countryCode}`, "")
      .trim();

    // Prepare the request body for the API
    const requestBody = {
      countryCode,
      customerName: values.customerName,
      email: values.email,
      nationality: values.nationality,
      passportNumber: values.passportNumber,
      passport: values.passport,
      drivingLicenseNumber: values.drivingLicenseNumber,
      phoneNumber,
      drivingLicense: values.drivingLicense,
      customerProfilePic: values.customerProfilePic || null, // Optional field for user profile, default to null if not provided
    };

    // Sending the request as a JSON object
    const data = await API.post<AddSRMCustomerFormResponse>({
      slug: Slug.PUT_SRM_CUSTOMER,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to post customer registration response");
    }

    return data;
  } catch (error) {
    console.error("Error on customer registration", error);
    throw error;
  }
};

export const getSRMCustomerFormDetails = async (
  customerId: string,
): Promise<GetSRMCustomerDetailsResponse> => {
  try {
    // Sending the request as a JSON object
    const data = await API.get<GetSRMCustomerDetailsResponse>({
      slug: `${Slug.GET_SRM_CUSTOMER}?customerId=${customerId}`,
    });

    if (!data) {
      throw new Error("Failed to get srm customer response");
    }

    return data;
  } catch (error) {
    console.error("Error on GET customer details", error);
    throw error;
  }
};
