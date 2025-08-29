import { RidePromotionFormType } from "@/types/formTypes";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchSpecificPromotionResponse,
  FetchRidePromotionsResponse,
} from "@/types/api-types/API-types";

export interface PromotionType {
  promotionImage: string;
  promotionLink: string;
}

// add promotion
export async function addRidePromotions(
  data: RidePromotionFormType & {
    promotionForId: string;
    promotionFor: string;
  },
) {
  try {
    const response = await API.post({
      slug: Slug.ADD_RIDE_PROMOTION,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to save promotion");
    }

    return response;
  } catch (error) {
    console.error("Error saving ride promotions:", error);
    throw error;
  }
}

export async function updateRidePromotions(
  data: RidePromotionFormType & {
    promotionForId: string;
    promotionFor: string;
  },
) {
  try {
    const response = await API.put({
      slug: Slug.PUT_RIDE_PROMOTION,
      body: data,
    });

    if (!response) {
      throw new Error("Failed to save promotion");
    }

    return response;
  } catch (error) {
    console.error("Error saving ride promotions:", error);
    throw error;
  }
}

// fetch specific promotion  by ID
export const fetchRidePromotionById = async (
  promotionId: string,
): Promise<FetchSpecificPromotionResponse> => {
  try {
    const data = await API.get<FetchSpecificPromotionResponse>({
      slug: `${Slug.GET_PROMOTION}?promotionId=${promotionId}`, //
    });

    if (!data) {
      throw new Error("Failed to fetch ad data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

// /api/promotions.ts
export const fetchAllRidePromotions = async (urlParams: {
  promotionForId: string;
  promotionFor: "state" | "parentState" | "country";
}): Promise<FetchRidePromotionsResponse> => {
  const queryParams = new URLSearchParams({
    promotionForId: urlParams.promotionForId,
    promotionFor: urlParams.promotionFor,
  });
  try {
    const data = await API.get<FetchRidePromotionsResponse>({
      slug: `${Slug.GET_RIDE_PROMOTION}?${queryParams.toString()}`,
    });

    if (!data) {
      throw new Error("Failed to fetch promotion data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching ride promotions:", error);
    throw error;
  }
};

// delete specific promotion  by ID
export const deleteRidePromotion = async (promotionId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_PROMOTION}?promotionId=${promotionId}`,
    });

    return data;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    throw error;
  }
};
