import {
  FetchSpecificTypeResponse,
  FetchTypesResponse,
} from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

type VehicleTypeType = {
  name: string
  value: string
}

// add location
export const addVehicleType = async (
  values: VehicleTypeType,
  vehicleCategoryId: string
) => {
  try {
    const reqBody = {
      ...values,
      vehicleCategoryId,
    }

    const data = await API.post({
      slug: `${Slug.ADD_VEHICLE_TYPE}`,
      body: reqBody,
    })

    return data
  } catch (error) {
    console.error('Error adding vehicle type:', error)
    throw error
  }
}

// update vehicle type
export const updateVehicleType = async (
  values: VehicleTypeType,
  typeId: string
) => {
  try {
    const reqBody = {
      ...values,
      typeId,
    }

    const data = await API.put({
      slug: Slug.PUT_VEHICLE_TYPE,
      body: reqBody,
    })
    return data
  } catch (error) {
    console.error('Error fetching locations:', error)
    throw error
  }
}

// fetch specific type by ID
export const fetchVehicleTypeById = async (
  typeId: string
): Promise<FetchSpecificTypeResponse> => {
  try {
    const data = await API.get<FetchSpecificTypeResponse>({
      slug: `${Slug.GET_VEHICLE_TYPE}?typeId=${typeId}`,
    })
    if (!data) {
      throw new Error('Failed to fetch vehicle type data ')
    }

    return data
  } catch (error) {
    console.error('Error fetching locations:', error)
    throw error
  }
}

// fetch all vehicle types
export const fetchAllVehicleTypes = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  vehicleCategoryId: string
}): Promise<FetchTypesResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      vehicleCategoryId: urlParams.vehicleCategoryId,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_VEHICLE_TYPE}?${queryParams}`

    const data = await API.get<FetchTypesResponse>({
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
