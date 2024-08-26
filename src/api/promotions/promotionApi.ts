import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificPromotionResponse,
  FetchPromotionsResponse,
} from '@/types/api-types/API-types'

export interface PromotionType {
  promotionImage: File | string
  promotionLink: string
}

// add promotion
export const addPromotion = async (values: PromotionType, stateId: string) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('stateId', stateId)
    formData.append('promotionLink', values.promotionLink)
    formData.append('promotionImage', values.promotionImage)

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_PROMOTION,
      body: formData, // Passing formData instead of JSON object
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error adding ad:', error)
    throw error
  }
}

// update Promotion
export const updatePromotion = async (
  values: PromotionType,
  promotionId: string
) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('promotionLink', values.promotionLink)
    formData.append('promotionId', promotionId)

    // Check if the promotionImage is a File (new image) or a string (existing URL)
    if (values.promotionImage instanceof File) {
      formData.append('promotionImage', values.promotionImage)
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: `${Slug.PUT_PROMOTION}`, // Use the correct slug
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error updating ad:', error)
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
    console.error('Error fetching State:', error)
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
export const deletePromotion = async (stateId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_PROMOTION}?stateId=${stateId}`,
    })

    return data
  } catch (error) {
    console.error('Error deleting States:', error)
    throw error
  }
}
