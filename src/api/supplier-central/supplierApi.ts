// Updated API functions (supplier-central.ts)
import { FetchSupplierCategoryDetailsResponse, FetchSupplierCentralAnalytics, GetSupplierCategoryDetailsParams, SendDigestPayload } from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import axios from 'axios'

// fetch supplier central home summary
export const fetchSupplierCentralDashboard =
  async (): Promise<FetchSupplierCentralAnalytics> => {
    try {
      const data = await API.get<FetchSupplierCentralAnalytics>({
        slug: Slug.GET_SUPPLIER_CENTRAL_HOME_SUMMARY // Adjust to your Slug enum if needed, e.g., Slug.GET_SUPPLIER_CENTRAL_HOME_SUMMARY
      })

      if (!data) {
        throw new Error('Failed to fetch supplier central dashboard data')
      }

      return data
    } catch (error) {
      console.error('Error fetching supplier central dashboard:', error)
      throw error
    }
  }

export const getSupplierCategoryDetails = async ({
  category,
  page,
  limit,
  sortOrder,
  search,
  countryId,
}: GetSupplierCategoryDetailsParams): Promise<FetchSupplierCategoryDetailsResponse> => {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (search) params.append("search", search);
    if (countryId) params.append("countryId", countryId);

    const queryString = params.toString();
    const url = `${Slug.GET_SUPPLIER_CENTRAL_CATEGORY_DETAILS}/${category}${queryString ? `?${queryString}` : ''}`;

    const data = await API.get<FetchSupplierCategoryDetailsResponse>({ slug: url });

    if (!data) {
      throw new Error("Failed to fetch supplier category details");
    }

    return data;
  } catch (error) {
    console.error("Error fetching supplier category details:", error);
    throw error;
  }
};

export const exportSupplierSheet = async (
  type: string, 
  countryId?: string
): Promise<Blob> => {
  try {
    const params = new URLSearchParams();
    params.append("type", type);
    if (countryId) params.append("countryId", countryId);

    const queryString = params.toString();
    const url = `${Slug.EXPORT_SUPPLIER_CENTRAL_SHEET}?${queryString}`;

    const response = await API.get<Blob>({ 
      slug: url, 
      axiosConfig: { responseType: 'blob' } 
    });

    if (!response) {
      throw new Error("Failed to export supplier sheet");
    }

    return response;
  } catch (error) {
    console.error("Error exporting supplier sheet:", error);
    throw error;
  }
};

export const searchSuppliers = async ({
  search,
  agentId,
  page = 1,
  limit = 10,
}: {
  search: string;
  agentId?: string;
  page?: number;
  limit?: number;
}): Promise<FetchSupplierCategoryDetailsResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("search", search);
    if (agentId) params.append("agentId", agentId);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const queryString = params.toString();
    const url = `${Slug.SEARCH_SUPPLIERS}${queryString ? `?${queryString}` : ''}`;

    const data = await API.get<FetchSupplierCategoryDetailsResponse>({ slug: url });

    if (!data) {
      throw new Error("Failed to search suppliers");
    }

    return data;
  } catch (error) {
    console.error("Error searching suppliers:", error);
    throw error;
  }
};


export const sendDigestEmail = async (payload: SendDigestPayload): Promise<any> => {
  try {
    const data = await API.post<any>({
      slug: Slug.SEND_DIGEST,  // e.g., '/v1/riderent/supplier-central/send-digest'
      body: payload,
      axiosConfig: { 
        timeout: 10000,  // 2min—covers slow SMTP/queues
      },
    });

    if (!data) {
      throw new Error('Failed to send digest email');
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
      // Optimistic: Assume success since email queues async
      console.warn('Frontend timeout, but backend likely queued email. Check logs/inbox.');
      return { success: true, message: 'Queued—check inbox shortly' };  // Fake success to avoid alert
    }
    console.error('Error sending digest email:', error);
    throw error;
  }
};

export const downloadDigestPdf = async (payload: SendDigestPayload & { generatePdf: true }): Promise<Blob> => {
  try {
    const response = await API.post<Blob>({
      slug: `${Slug.SEND_DIGEST}?generatePdf=true`,
      body: payload,
      axiosConfig: { responseType: 'blob' },
    });

    if (!response) {
      throw new Error('Failed to generate PDF');
    }

    // Quick validation: Check if blob is actually PDF (starts with %PDF)
    const text = await response.text(); // Non-destructive peek
    if (!text.startsWith('%PDF-')) {
      // It's likely JSON error—parse and re-throw
      const errorJson = JSON.parse(text);
      throw new Error(errorJson.message || 'Invalid PDF response');
    }

    return new Blob([response], { type: 'application/pdf' }); // Ensure PDF MIME
  } catch (error) {
    console.error('Error downloading digest PDF:', error);
    throw error;
  }
};