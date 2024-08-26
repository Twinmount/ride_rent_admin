import {
  FetchSpecificBrandResponse,
  FetchBrandsResponse,
} from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

type BrandType = {
  brandId?: string
  brandName: string
  brandValue: string
  vehicleCategoryId: string
  subHeading: string
  metaTitle: string
  metaDescription: string
  brandLogo: File | string
}

// add location
export const addBrand = async (
  values: BrandType,
  vehicleCategoryId: string
) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('vehicleCategoryId', vehicleCategoryId)
    formData.append('brandName', values.brandName)
    formData.append('brandValue', values.brandValue)
    formData.append('subHeading', values.subHeading)
    formData.append('metaTitle', values.metaTitle)
    formData.append('metaDescription', values.metaDescription)

    // Append the file to FormData if it exists
    if (values.brandLogo) {
      formData.append('brandLogo', values.brandLogo)
    }

    const data = await API.post({
      slug: `${Slug.ADD_BRAND}`,
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })
    return data
  } catch (error) {
    console.error('Error adding brands:', error)
    throw error
  }
}

// update brand
export const updateBrand = async (values: BrandType, brandId: string) => {
  try {
    console.log('values from updateBrand', values)

    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('id', brandId)
    formData.append('brandName', values.brandName)
    formData.append('brandValue', values.brandValue)
    formData.append('vehicleCategoryId', values.vehicleCategoryId)
    formData.append('subHeading', values.subHeading)
    formData.append('metaTitle', values.metaTitle)
    formData.append('metaDescription', values.metaDescription)

    if (values.brandLogo instanceof File) {
      formData.append('brandLogo', values.brandLogo)
    }

    const data = await API.put({
      slug: `${Slug.PUT_BRAND}`,
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })
    return data
  } catch (error) {
    console.error('Error updating brands:', error)
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
