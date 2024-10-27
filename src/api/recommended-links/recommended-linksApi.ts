import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchSpecificLinkResponse,
  FetchLinksResponse,
} from "@/types/api-types/API-types";

export interface LinkType {
  label: string;
  link: string;
}

// add link
export const addRecommendedLink = async (values: LinkType, stateId: string) => {
  try {
    const requestBody = {
      ...values,
      stateId,
    };

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_RECOMMENDED_LINK,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error adding recommended links:", error);
    throw error;
  }
};

// update link
export const updateRecommendedLink = async (
  values: LinkType,
  linkId: string
) => {
  try {
    const requestBody = {
      ...values,
      linkId,
    };

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_RECOMMENDED_LINK,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating links:", error);
    throw error;
  }
};

// fetch specific Link by ID
export const fetchRecommendedLinkById = async (
  linkId: string
): Promise<FetchSpecificLinkResponse> => {
  try {
    const data = await API.get<FetchSpecificLinkResponse>({
      slug: `${Slug.GET_RECOMMENDED_LINK}?linkId=${linkId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch recommended link data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching recommended link:", error);
    throw error;
  }
};

// fetch all Links
export const fetchAllRecommendedLinks = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
  stateId: string;
}): Promise<FetchLinksResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      stateId: urlParams.stateId,
    }).toString();

    const slugWithParams = `${Slug.GET_ALL_RECOMMENDED_LINKS}?${queryParams}`;

    const data = await API.get<FetchLinksResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch recommended link data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching recommended links:", error);
    throw error;
  }
};

// delete specific link by ID
export const deleteRecommendedLink = async (linkId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_RECOMMENDED_LINK}?linkId=${linkId}`,
    });
    return data;
  } catch (error) {
    console.error("Error deleting Recommended link:", error);
    throw error;
  }
};
