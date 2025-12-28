import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  ContentFaq,
  ContentFaqResponse,
  CreateContentFaqRequest,
  FetchSeriesFaqsResponse,
  UpdateContentFaqRequest,
} from "@/types/api-types/contentFaqApi-types";

/**
 * Create a new FAQ for a series
 */
export const createSeriesFaq = async (
  data: CreateContentFaqRequest
): Promise<ContentFaqResponse> => {
  try {
    const response = await API.post<ContentFaqResponse>({
      slug: Slug.CONTENT_FAQ,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to create series FAQ");
    }

    return response;
  } catch (error) {
    console.error("Error creating series FAQ:", error);
    throw error;
  }
};

/**
 * Update an existing FAQ
 */
export const updateSeriesFaq = async (
  faqId: string,
  data: UpdateContentFaqRequest
): Promise<ContentFaqResponse> => {
  try {
    const response = await API.put<ContentFaqResponse>({
      slug: `${Slug.CONTENT_FAQ}/${faqId}`,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to update series FAQ");
    }

    return response;
  } catch (error) {
    console.error("Error updating series FAQ:", error);
    throw error;
  }
};

/**
 * Delete an FAQ
 */
export const deleteSeriesFaq = async (faqId: string): Promise<void> => {
  try {
    await API.delete({
      slug: `${Slug.CONTENT_FAQ}/${faqId}?faqType=series`,
    });
  } catch (error) {
    console.error("Error deleting series FAQ:", error);
    throw error;
  }
};

/**
 * Get all FAQs for a specific series
 */
export const getSeriesFaqs = async (
  seriesId: string
): Promise<FetchSeriesFaqsResponse> => {
  try {
    const response = await API.get<FetchSeriesFaqsResponse>({
      slug: `${Slug.GET_CONTENT_FAQ_BY_SERIES}/${seriesId}`,
    });

    if (!response) {
      throw new Error("Failed to fetch series FAQs");
    }

    return response;
  } catch (error) {
    console.error("Error fetching series FAQs:", error);
    throw error;
  }
};

/**
 * Get a single FAQ by ID
 */
export const getSeriesFaqById = async (
  faqId: string
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
