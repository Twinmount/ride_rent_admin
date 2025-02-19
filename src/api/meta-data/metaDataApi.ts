import {
  FetchCompanyPortfolioMetaResponse,
  FetchHomeMetaListResponse,
  FetchListingMetaListResponse,
  FetchSingleHomeMetaData,
  FetchSingleListingMetaData,
} from "@/types/api-types/API-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";

type HomeMetaType = {
  stateId: string;
  categoryId: string;
  metaTitle: string;
  metaDescription: string;
};

type ListingMetaType = {
  stateId: string;
  categoryId: string;
  typeId: string;
  metaTitle: string;
  metaDescription: string;
};

// fetch all promotions
export const fetchHomeMetaList = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  stateId: string;
}): Promise<FetchHomeMetaListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      state: urlParams.stateId,
    }).toString();

    const slugWithParams = `${Slug.GET_ADMIN_HOME_META_ALL}?${queryParams}`;

    const data = await API.get<FetchHomeMetaListResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch promotions data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

// fetch all promotions
export const fetchListingMetaList = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  state: string;
  category: string;
}): Promise<FetchListingMetaListResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      state: urlParams.state,
      category: urlParams.category,
    }).toString();

    const slugWithParams = `${Slug.GET_ADMIN_LISTING_META_ALL}?${queryParams}`;

    const data = await API.get<FetchListingMetaListResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch promotions data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

// add home meta data
export const addHomeMetaData = async (values: HomeMetaType) => {
  try {
    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.POST_ADMIN_HOME_META,
      body: values,
    });

    return data;
  } catch (error) {
    console.error("Error adding meta data:", error);
    throw error;
  }
};

// fetch specific meta data by ID
export const fetchHomeMetaDataById = async (
  metaDataId: string,
): Promise<FetchSingleHomeMetaData> => {
  try {
    const data = await API.get<FetchSingleHomeMetaData>({
      slug: `${Slug.GET_ADMIN_HOME_META}?metaDataId=${metaDataId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch meta data id");
    }

    return data;
  } catch (error) {
    console.error("Error fetching meta data by id:", error);
    throw error;
  }
};

// update link
export const updateHomeMetaData = async (
  values: HomeMetaType,
  metaDataId: string,
) => {
  try {
    const requestBody = {
      ...values,
      metaDataId,
    };

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_ADMIN_HOME_META,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating home meta data:", error);
    throw error;
  }
};

// add home meta data
export const addListingMetaData = async (values: ListingMetaType) => {
  try {
    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.POST_ADMIN_LISTING_META,
      body: values,
    });

    return data;
  } catch (error) {
    console.error("Error adding listing meta data:", error);
    throw error;
  }
};

// fetch specific meta data by ID
export const fetchListingMetaDataById = async (
  metaDataId: string,
): Promise<FetchSingleListingMetaData> => {
  try {
    const data = await API.get<FetchSingleListingMetaData>({
      slug: `${Slug.GET_ADMIN_LISTING_META}?metaDataId=${metaDataId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch meta data id");
    }

    return data;
  } catch (error) {
    console.error("Error fetching meta data by id:", error);
    throw error;
  }
};

// update link
export const updateListingMetaData = async (
  values: ListingMetaType,
  metaDataId: string,
) => {
  try {
    const requestBody = {
      ...values,
      metaDataId,
    };

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_ADMIN_LISTING_META,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating listing meta data:", error);
    throw error;
  }
};

// fetch all promotions
export const fetchCompanyPortfolioMetaList = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  search: string;
}): Promise<FetchCompanyPortfolioMetaResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    });

    if (urlParams.search) {
      queryParams.append("search", urlParams.search);
    }

    const params = queryParams.toString();

    const slugWithParams = `${Slug.GET_COMPANY_META_ALL}?${params}`;

    const data = await API.get<FetchCompanyPortfolioMetaResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch company meta data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching company meta:", error);
    throw error;
  }
};
