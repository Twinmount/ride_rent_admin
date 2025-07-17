import { RidePromotionFormType } from "@/types/formTypes";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import {
  FetchSpecificPromotionResponse,
  FetchPromotionsResponse,
} from "@/types/api-types/API-types";

export interface PromotionType {
  promotionImage: string;
  promotionLink: string;
}

// add promotion
export async function saveRidePromotions(
  data: RidePromotionFormType & {
    promotionForId: string;
    promotionFor: string;
  },
) {
  try {
    const response = await fetch(`/api/ride-promotions`, {
      method: "POST", // or PUT for updates
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
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
  stateId: string;
  promotionFor: "state" | "parentState" | "country";
}): Promise<{ result: any }> => {
  try {
    // Later you’ll call your real API here
    console.log("Fetching promotions for:", urlParams);

    // Mimic API response with sample data
    const samplePromotions = {
      sectionTitle: "Top Vehicle Promotions",
      sectionSubtitle: "Exclusive deals and discounts in your area.",
      cards: [
        {
          _id: "promo1",
          image: "https://via.placeholder.com/400x300.png?text=Car+1",
          cardTitle: "Offer Upto 25%",
          cardSubtitle: "Discount on SUV rentals for this month.",
          link: "/ae/dubai/cars/123",
        },
        {
          _id: "promo2",
          image: "https://via.placeholder.com/400x300.png?text=Car+2",
          cardTitle: "Save 15% on Sedans",
          cardSubtitle: "Enjoy sedan rentals at 15% off in Bengaluru.",
          link: "/in/bengaluru/cars/456",
        },
      ],
    };

    return {
      result: null,
    };
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
