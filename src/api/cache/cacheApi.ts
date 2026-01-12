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
    const FQDN_DOMAIN_UAE = ENV.FQDN_DOMAIN_UAE;
    const FQDN_DOMAIN_INDIA = ENV.FQDN_DOMAIN_INDIA;

    const urlUAE = `${FQDN_DOMAIN_UAE}${Slug.NEXTJS_REVALIDATE_CACHE}`;
    const urlIndia = `${FQDN_DOMAIN_INDIA}${Slug.NEXTJS_REVALIDATE_CACHE}`;

    const [uaeResult, indiaResult] = await Promise.all([
      API.post<RevalidateResponse>({
        slug: `${urlUAE}`,
        body: payload,
      }),
      API.post<RevalidateResponse>({
        slug: `${urlIndia}`,
        body: payload,
      }),
    ]);

    console.log("✅ UAE cache revalidated:", uaeResult);
    console.log("✅ India cache revalidated:", indiaResult);

    // Return UAE result (both should be identical)
    if (!uaeResult) {
      throw new Error("Failed to revalidate cache in UAE FQDN");
    }

    if (!indiaResult) {
      throw new Error("Failed to revalidate cache in India FQDN");
    }

    return uaeResult;
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
