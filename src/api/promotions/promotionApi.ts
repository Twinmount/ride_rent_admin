import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificPromotionResponse,
  FetchPromotionsResponse,
} from '@/types/api-types/API-types'

export interface PromotionType {
  promotionImage: string
  promotionLink: string
}

// add promotion
export const addPromotion = async (values: PromotionType, stateId: string) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_PROMOTION,
      body: {
        stateId: stateId,
        promotionLink: values.promotionLink,
        promotionImage: values.promotionImage, // Assuming this is a URL or string
      },
    })

    return data
  } catch (error) {
    console.error('Error adding promotion:', error)
    throw error
  }
}

// update promotion
export const updatePromotion = async (
  values: PromotionType,
  promotionId: string
) => {
  try {
    const data = await API.put({
      slug: `${Slug.PUT_PROMOTION}`,
      body: {
        promotionId: promotionId,
        promotionLink: values.promotionLink,
        promotionImage: values.promotionImage, // Assuming this is a URL or string
      },
    })

    return data
  } catch (error) {
    console.error('Error updating promotion:', error)
    throw error
  }
}

// fetch specific promotion  by ID
export const fetchPromotionById = async (
  promotionId: string
): Promise<FetchSpecificPromotionResponse> => {
  try {
    const data = await API.get<FetchSpecificPromotionResponse>({
      slug: `${Slug.GET_PROMOTION}?promotionId=${promotionId}`, //
    })

    if (!data) {
      throw new Error('Failed to fetch ad data')
    }

    return data
  } catch (error) {
    console.error('Error fetching promotions:', error)
    throw error
  }
}

// fetch all promotions
export const fetchAllPromotions = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  stateId: string
}): Promise<FetchPromotionsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      stateId: urlParams.stateId,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_PROMOTIONS}?${queryParams}`

    const data = await API.get<FetchPromotionsResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch promotions data')
    }

    return data
  } catch (error) {
    console.error('Error fetching promotions:', error)
    throw error
  }
}

// delete specific promotion  by ID
export const deletePromotion = async (promotionId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_PROMOTION}?promotionId=${promotionId}`,
    })

    return data
  } catch (error) {
    console.error('Error deleting promotion:', error)
    throw error
  }
}
