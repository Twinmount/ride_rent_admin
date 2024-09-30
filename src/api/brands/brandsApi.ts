import {
  FetchSpecificBrandResponse,
  FetchBrandsResponse,
} from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

type BrandType = {
  brandName: string
  brandValue: string
  vehicleCategoryId: string
  brandLogo: string
}

// add brand
export const addBrand = async (
  values: BrandType,
  vehicleCategoryId: string
) => {
  try {
    const data = await API.post({
      slug: `${Slug.ADD_BRAND}`,
      body: {
        vehicleCategoryId: vehicleCategoryId,
        brandName: values.brandName,
        brandValue: values.brandValue,
        brandLogo: values.brandLogo, // Assuming this is the URL of the uploaded logo
      },
    })
    return data
  } catch (error) {
    console.error('Error adding brand:', error)
    throw error
  }
}

// update brand
export const updateBrand = async (values: BrandType, brandId: string) => {
  try {
    const data = await API.put({
      slug: `${Slug.PUT_BRAND}`,
      body: {
        id: brandId,
        brandName: values.brandName,
        brandValue: values.brandValue,
        vehicleCategoryId: values.vehicleCategoryId,
        brandLogo: values.brandLogo, // Assuming this is the URL of the uploaded logo
      },
    })
    return data
  } catch (error) {
    console.error('Error updating brand:', error)
    throw error
  }
}

// fetch specific brand by ID
export const fetchBrandById = async (
  brandId: string
): Promise<FetchSpecificBrandResponse> => {
  try {
    const data = await API.get<FetchSpecificBrandResponse>({
      slug: `${Slug.GET_BRAND}?id=${brandId}`,
    })
    if (!data) {
      throw new Error('Failed to fetch brand data ')
    }

    return data
  } catch (error) {
    console.error('Error fetching brand:', error)
    throw error
  }
}

// fetch all brands
export const fetchAllBrands = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  vehicleCategoryId: string
  search: string
}): Promise<FetchBrandsResponse> => {
  try {
    // generating query params
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      vehicleCategoryId: urlParams.vehicleCategoryId,
      search: urlParams.search,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_BRANDS}?${queryParams}`

    const data = await API.get<FetchBrandsResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch brands data')
    }
    return data
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw error
  }
}

// delete specific state by ID
export const deleteBrand = async (brandId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_BRAND}?id=${brandId}`,
    })
    return data
  } catch (error) {
    console.error('Error deleting brands:', error)
    throw error
  }
}
