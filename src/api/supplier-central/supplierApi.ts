// Updated API functions (supplier-central.ts)
import { FetchSupplierCategoryDetailsResponse, FetchSupplierCentralAnalytics, GetSupplierCategoryDetailsParams } from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

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