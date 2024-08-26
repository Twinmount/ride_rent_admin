import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchCategoriesResponse,
  SpecificCategoryResponse,
} from '@/types/api-types/API-types'

interface CategoryType {
  name: string
  value: string
}

// add new category
export const addCategory = async (values: CategoryType) => {
  try {
    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_CATEGORY,
      body: values,
    })

    return data
  } catch (error) {
    console.error('Error adding state:', error)
    throw error
  }
}

// update existing category
export const updateCategory = async (
  values: CategoryType,
  categoryId: string
) => {
  try {
    const updatedValues = { ...values, categoryId }

    const data = await API.put({
      slug: Slug.PUT_CATEGORY, // Use the correct slug
      body: updatedValues,
    })

    return data
  } catch (error) {
    console.error('Error updating state:', error)
    throw error
  }
}

// fetch specific category by ID
export const fetchCategoryById = async (
  categoryId: string
): Promise<SpecificCategoryResponse> => {
  try {
    const data = await API.get<SpecificCategoryResponse>({
      slug: `${Slug.GET_CATEGORY}?categoryId=${categoryId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch state data')
    }

    return data
  } catch (error) {
    console.error('Error fetching State:', error)
    throw error
  }
}

// fetch all categories
export const fetchAllCategories = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
}): Promise<FetchCategoriesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
    }).toString()

    // Attach the query parameters to the slug
    const slugWithParams = `${Slug.GET_ALL_CATEGORIES}?${queryParams}`

    const data = await API.get<FetchCategoriesResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch categories data')
    }
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

// delete specific category by ID
export const deleteCategory = async (stateId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_CATEGORY}?stateId=${stateId}`,
    })
    return data
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
