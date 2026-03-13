import {
  FetchAllBookingsResponse,
  BookingDetailsType,
} from "@/types/api-types/srm-api.types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";

/**
 * Fetch all booking details with pagination and filtering
 */
export const fetchAllBookings = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<FetchAllBookingsResponse> => {
  try {
    const normalizedSearch = urlParams.search?.trim();

    // Generate query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (normalizedSearch) {
      // Backend `/bookings/list` filters by `bookingId`.
      queryParams.append("bookingId", normalizedSearch);
    }

    const slugWithParams = `${Slug.GET_ALL_OREDERS}?${queryParams}`;

    const data = await API.get<FetchAllBookingsResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch booking details");
    }
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

/**
 * Fetch a single booking detail by booking ID
 */
export const getBookingDetails = async (
  bookingId: string,
): Promise<BookingDetailsType> => {
  try {
    const data = await API.get<{ result: BookingDetailsType }>({
      slug: `${Slug.GET_ALL_OREDERS}/${bookingId}/detailed`,
    });

    if (!data) {
      throw new Error("Failed to fetch booking details");
    }
    return data.result;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

export const downloadBookingDetailsExcel = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search?: string;
}): Promise<void> => {
  try {
    const normalizedSearch = urlParams.search?.trim();

    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (normalizedSearch) {
      queryParams.append("bookingId", normalizedSearch);
    }

    const slugWithParams = `${Slug.DOWNLOAD_ORDER_DETAILS_EXCEL}?${queryParams}`;

    // Using your API.get pattern with blob response
    const response = await API.get<Blob>({
      slug: slugWithParams,
      axiosConfig: { responseType: 'blob' },
    });

    if (response) {
      const url = window.URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `booking-details-${date}.xlsx`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error('Failed to download booking details');
    }
  } catch (error) {
    console.error('Error downloading booking details Excel:', error);
    throw error;
  }
};

export const downloadBookingInvoice = async (
  bookingId: string,
): Promise<void> => {
  try {
    const response = await API.get<Blob>({
      slug: `${Slug.DOWNLOAD_BOOKING_INVOICE}/${bookingId}/invoice/download`,
      axiosConfig: { responseType: "blob" },
    });

    if (!response) {
      throw new Error("Failed to download booking invoice");
    }

    const url = window.URL.createObjectURL(response);
    const link = document.createElement("a");
    const safeBookingId = bookingId.trim() || "booking";

    link.href = url;
    link.setAttribute("download", `invoice-${safeBookingId}.pdf`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading booking invoice:", error);
    throw error;
  }
};
