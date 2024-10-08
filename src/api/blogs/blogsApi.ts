import {
  FetchBlogPromotionsResponse,
  FetchBlogsResponse,
  FetchSpecificBlogPromotionResponse,
  FetchSpecificBlogResponse,
} from '@/types/api-types/blogApi-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

export interface BlogType {
  blogTitle: string
  blogDescription: string
  blogImage: string
  blogCategory: string
  authorName: string
  metaTitle: string
  metaDescription: string
  blogContent: string
}

export interface FetchAllBlogsRequest {
  page: string
  limit: string
  sortOrder: 'ASC' | 'DESC'
  blogCategory?: string[]
}

export interface PromotionType {
  promotionImage: string
  promotionLink: string
}

// add state
export const addBlog = async (values: BlogType) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_BLOG,
      body: values,
    })

    return data
  } catch (error) {
    console.error('Error adding blog:', error)
    throw error
  }
}

// update state
export const updateBlog = async (values: BlogType, blogId: string) => {
  try {
    const requestBody = {
      ...values,
      blogId,
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_BLOG, // Use the correct slug
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating state:', error)
    throw error
  }
}

// fetch specific state by ID
export const fetchBlogById = async (
  blogId: string
): Promise<FetchSpecificBlogResponse> => {
  try {
    const data = await API.get<FetchSpecificBlogResponse>({
      slug: `${Slug.GET_BLOG}?blogId=${blogId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch blog data')
    }

    return data
  } catch (error) {
    console.error('Error fetching blog:', error)
    throw error
  }
}

export const fetchAllBlogs = async (
  requestBody: FetchAllBlogsRequest
): Promise<FetchBlogsResponse> => {
  try {
    const data = await API.post<FetchBlogsResponse>({
      slug: Slug.GET_ALL_BLOGS,
      body: requestBody,
    })

    if (!data) {
      throw new Error('Failed to fetch blogs data')
    }

    return data
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

// delete specific state by ID
export const deleteBlog = async (stateId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_STATE}?stateId=${stateId}`,
    })
    return data
  } catch (error) {
    console.error('Error deleting States:', error)
    throw error
  }
}

// add blog promotion
export const addBlogPromotion = async (values: PromotionType) => {
  try {
    const data = await API.post({
      slug: Slug.ADD_BLOG_PROMOTION,
      body: {
        promotionLink: values.promotionLink,
        promotionImage: values.promotionImage,
      },
    })

    return data
  } catch (error) {
    console.error('Error adding promotion:', error)
    throw error
  }
}

// update promotion
export const updateBlogPromotion = async (
  values: PromotionType,
  promotionId: string
) => {
  try {
    const data = await API.put({
      slug: `${Slug.PUT_BLOG_PROMOTION}`,
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
export const fetchBlogPromotionById = async (
  promotionId: string
): Promise<FetchSpecificBlogPromotionResponse> => {
  try {
    const data = await API.get<FetchSpecificBlogPromotionResponse>({
      slug: `${Slug.GET_BLOG_PROMOTION}?promotionId=${promotionId}`, //
    })

    if (!data) {
      throw new Error('Failed to fetch blog promotion data')
    }

    return data
  } catch (error) {
    console.error('Error fetching blog promotions:', error)
    throw error
  }
}

// fetch all promotions
export const fetchAllBlogPromotions = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
}): Promise<FetchBlogPromotionsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_BLOG_PROMOTIONS}?${queryParams}`

    const data = await API.get<FetchBlogPromotionsResponse>({
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
export const deleteBlogPromotion = async (promotionId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_BLOG_PROMOTION}?promotionId=${promotionId}`,
    })

    return data
  } catch (error) {
    console.error('Error deleting States:', error)
    throw error
  }
}
