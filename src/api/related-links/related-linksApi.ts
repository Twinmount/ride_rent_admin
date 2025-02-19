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
export const addRelatedLink = async (values: LinkType, stateId: string) => {
  try {
    const requestBody = {
      ...values,
      stateId,
    };

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_RELATED_LINK,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error adding related links:", error);
    throw error;
  }
};

// update link
export const updateRelatedLink = async (values: LinkType, linkId: string) => {
  try {
    const requestBody = {
      ...values,
      linkId,
    };

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_RELATED_LINK,
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating related links:", error);
    throw error;
  }
};

// fetch specific Link by ID
export const fetchRelatedLinkById = async (
  linkId: string,
): Promise<FetchSpecificLinkResponse> => {
  try {
    const data = await API.get<FetchSpecificLinkResponse>({
      slug: `${Slug.GET_RELATED_LINK}?linkId=${linkId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch related link data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching related link:", error);
    throw error;
  }
};

// fetch all Links
export const fetchAllRelatedLinks = async (urlParams: {
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

    const slugWithParams = `${Slug.GET_ALL_RELATED_LINKS}?${queryParams}`;

    const data = await API.get<FetchLinksResponse>({
      slug: slugWithParams,
    });

    if (!data) {
      throw new Error("Failed to fetch related link data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching related links:", error);
    throw error;
  }
};

// delete specific link by ID
export const deleteRelatedLink = async (linkId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_RELATED_LINK}?linkId=${linkId}`,
    });
    return data;
  } catch (error) {
    console.error("Error deleting related link:", error);
    throw error;
  }
};
