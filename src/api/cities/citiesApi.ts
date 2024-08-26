import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchCitiesResponse,
  FetchSpecificCityResponse,
} from '@/types/api-types/API-types'

type CityType = {
  cityName: string
  cityValue: string
}

// add city
export const addCity = async (values: CityType, stateId: string) => {
  const requestBody = {
    ...values,
    stateId,
  }

  try {
    const data = await API.post({
      slug: Slug.ADD_CITY,
      body: requestBody,
    })
    return data
  } catch (error) {
    console.error('Error adding City:', error)
    throw error
  }
}

// update city
export const updateCity = async (values: CityType, cityId: string) => {
  try {
    const requestBody = {
      ...values,
      cityId,
    }

    const data = await API.put({
      slug: Slug.PUT_CITY,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating City:', error)
    throw error
  }
}

// fetch specific city by ID
export const fetchCityById = async (
  cityId: string
): Promise<FetchSpecificCityResponse> => {
  try {
    const data = await API.get<FetchSpecificCityResponse>({
      slug: `${Slug.GET_CITY}?cityId=${cityId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch city data')
    }

    return data
  } catch (error) {
    console.error('Error fetching city:', error)
    throw error
  }
}

// fetch all cities
export const fetchAllCities = async (
  stateId: string
): Promise<FetchCitiesResponse> => {
  try {
    const data = await API.get<FetchCitiesResponse>({
      slug: `${Slug.GET_ALL_CITIES}?stateId=${stateId}`,
    })
    if (!data) {
      throw new Error('Failed to fetch city data')
    }

    return data
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}

// delete specific city by ID
export const deleteCity = async (cityId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_CITY}?cityId=${cityId}`,
    })
    return data
  } catch (error) {
    console.error('Error deleting States:', error)
    throw error
  }
}
