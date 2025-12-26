import { ENV } from "@/config/env.config";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";

interface RevalidatePayload {
  type: "path" | "tag";
  value: string;
}

interface RevalidateResponse {
  success: boolean;
  type: string;
  value: string;
  message: string;
  timestamp: string;
}

/**
 * Call Next.js revalidation API
 */
export const revalidateCache = async (
  payload: RevalidatePayload,
): Promise<RevalidateResponse> => {
  try {
    const BASE_DOMAIN = ENV.BASE_DOMAIN;

    const url = `${BASE_DOMAIN}${Slug.NEXTJS_REVALIDATE_CACHE}`;

    const response = await API.post<RevalidateResponse>({
      slug: `${url}`,
      body: payload,
    });

    if (!response) {
      throw new Error("Failed to revalidate cache");
    }

    return response;
  } catch (error) {
    console.error("Error revalidating cache:", error);
    throw error;
  }
};

/**
 * Revalidate by path
 */
export const revalidatePath = async (
  path: string,
): Promise<RevalidateResponse> => {
  return revalidateCache({ type: "path", value: path });
};

/**
 * Revalidate by tag
 */
export const revalidateTag = async (
  tag: string,
): Promise<RevalidateResponse> => {
  return revalidateCache({ type: "tag", value: tag });
};
