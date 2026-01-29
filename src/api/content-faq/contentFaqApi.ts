import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  ContentFaqResponse,
  CreateContentFaqRequest,
  FaqType,
  FetchFaqsResponse,
  UpdateContentFaqRequest,
} from "@/types/api-types/contentFaqApi-types";

/**
 * Create a new FAQ (Series or Vehicle Bucket)
 */
export const createContentFaq = async (
  data: CreateContentFaqRequest,
): Promise<ContentFaqResponse> => {
  try {
    const response = await API.post<ContentFaqResponse>({
      slug: Slug.CONTENT_FAQ,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to create FAQ");
    }

    return response;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
};

/**
 * Update an existing FAQ
 */
export const updateContentFaq = async (
  faqId: string,
  data: UpdateContentFaqRequest,
): Promise<ContentFaqResponse> => {
  try {
    const response = await API.put<ContentFaqResponse>({
      slug: `${Slug.CONTENT_FAQ}/${faqId}`,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to update FAQ");
    }

    return response;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

/**
 * Delete an FAQ
 */
export const deleteContentFaq = async (
  faqId: string,
  faqType: FaqType,
): Promise<void> => {
  try {
    await API.delete({
      slug: `${Slug.CONTENT_FAQ}/${faqId}?faqType=${faqType}`,
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};

/**
 * Get all FAQs for a specific target ID (Series ID or Vehicle Bucket ID)
 */
export const getContentFaqsByTarget = async (
  targetId: string,
): Promise<FetchFaqsResponse> => {
  try {
    const response = await API.get<FetchFaqsResponse>({
      slug: `${Slug.GET_CONTENT_FAQ_BY_TARGET}/${targetId}`,
    });

    if (!response) {
      throw new Error("Failed to fetch FAQs");
    }

    return response;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

/**
 * Get a single FAQ by ID
 */
export const getContentFaqById = async (
  faqId: string,
): Promise<ContentFaqResponse> => {
  try {
    const response = await API.get<ContentFaqResponse>({
      slug: `${Slug.CONTENT_FAQ}/${faqId}`,
    });

    if (!response) {
      throw new Error("Failed to fetch FAQ");
    }

    return response;
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    throw error;
  }
};
