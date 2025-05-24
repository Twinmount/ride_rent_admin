import {
  FetchAdvisorBlogPromotionsResponse,
  FetchBlogPromotionsResponse,
  FetchBlogsResponse,
  FetchSpecificBlogPromotionResponse,
  FetchSpecificBlogResponse,
} from "@/types/api-types/blogApi-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { AdvisorBlogFormType, AdvisorPromotionFormType } from "@/types/types";
import { FetchAllBlogsRequest } from "@/types/api-types/API-types";

// add state
export const addAdvisorBlog = async (values: AdvisorBlogFormType) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_ADVISOR_BLOG,
      body: values,
    });

    return data;
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

// update state
export const updateAdvisorBlog = async (
  values: AdvisorBlogFormType,
  blogId: string,
) => {
  try {
    const requestBody = {
      ...values,
      blogId,
    };

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_ADVISOR_BLOG, // Use the correct slug
      body: requestBody,
    });

    return data;
  } catch (error) {
    console.error("Error updating advisor blog:", error);
    throw error;
  }
};

// fetch specific state by ID
export const fetchAdvisorBlogById = async (
  blogId: string,
): Promise<FetchSpecificBlogResponse> => {
  try {
    const data = await API.get<FetchSpecificBlogResponse>({
      slug: `${Slug.GET_ADVISOR_BLOG}?blogId=${blogId}`,
    });

    if (!data) {
      throw new Error("Failed to fetch blog data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

export const fetchAllAdvisorBlogs = async (
  requestBody: FetchAllBlogsRequest,
): Promise<FetchBlogsResponse> => {
  try {
    const data = await API.post<FetchBlogsResponse>({
      slug: Slug.GET_ALL_ADVISOR_BLOGS,
      body: requestBody,
    });

    if (!data) {
      throw new Error("Failed to fetch blogs data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// delete specific state by ID
export const deleteAdvisorBlogById = async (blogId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_ADVISOR_BLOG}?blogId=${blogId}`,
    });
    return data;
  } catch (error) {
    console.error("Error deleting States:", error);
    throw error;
  }
};

// add blog promotion
export const addAdvisorBlogPromotion = async (
  values: AdvisorPromotionFormType,
) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_ADVISOR_BLOG_PROMOTION,
      body: {
        promotionLink: values.promotionLink,
        promotionImage: values.promotionImage,
      },
    });

    return data;
  } catch (error) {
    console.error("Error adding advisor promotion:", error);
    throw error;
  }
};

// update promotion
export const updateAdvisorBlogPromotion = async (
  values: AdvisorPromotionFormType,
  promotionId: string,
) => {
  try {
    const data = await API.put({
      slug: `${Slug.PUT_ADVISOR_BLOG_PROMOTION}`,
      body: {
        promotionId: promotionId,
        promotionLink: values.promotionLink,
        promotionImage: values.promotionImage, // Assuming this is a URL or string
      },
    });

    return data;
  } catch (error) {
    console.error("Error updating promotion:", error);
    throw error;
  }
};

// fetch specific promotion  by ID
export const fetchAdvisorBlogPromotionById = async (
  promotionId: string,
): Promise<FetchSpecificBlogPromotionResponse> => {
  try {
    const data = await API.get<FetchSpecificBlogPromotionResponse>({
      slug: `${Slug.GET_ADVISOR_BLOG_PROMOTION}?promotionId=${promotionId}`, //
    });

    if (!data) {
      throw new Error("Failed to fetch blog promotion data");
    }

    return data;
  } catch (error) {
    console.error("Error fetching blog promotions:", error);
    throw error;
  }
};

// fetch all promotions
export const fetchAllAdvisorBlogPromotions = async (urlParams: {
  page: number;
  limit: number;
  sortOrder: string;
}): Promise<FetchAdvisorBlogPromotionsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    }).toString();

    const slugWithParams = `${Slug.GET_ALL_ADVISOR_BLOG_PROMOTIONS}?${queryParams}`;

    const data = await API.get<FetchBlogPromotionsResponse>({
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

// delete specific promotion  by ID
export const deleteAdvisorBlogPromotion = async (promotionId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_ADVISOR_BLOG_PROMOTION}?promotionId=${promotionId}`,
    });

    return data;
  } catch (error) {
    console.error("Error deleting States:", error);
    throw error;
  }
};
