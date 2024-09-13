import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificStateResponse,
  FetchStatesResponse,
} from '@/types/api-types/API-types'

export interface StateType {
  stateName: string
  stateValue: string
  subHeading: string
  metaTitle: string
  metaDescription: string
  stateImage: File | string
}

// add state
export const addState = async (values: StateType) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('stateName', values.stateName)
    formData.append('stateValue', values.stateValue)
    formData.append('subHeading', values.subHeading)
    formData.append('metaTitle', values.metaTitle)
    formData.append('metaDescription', values.metaDescription)

    // Append the file to FormData if it exists
    if (values.stateImage) {
      formData.append('stateImage', values.stateImage)
    }

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_STATE,
      body: formData, // Passing formData instead of JSON object
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error adding state:', error)
    throw error
  }
}

// update state
export const updateState = async (values: StateType, stateId: string) => {
  try {
    console.log('updateState api values:', values)
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('stateId', stateId)
    formData.append('stateName', values.stateName)
    formData.append('stateValue', values.stateValue)
    formData.append('subHeading', values.subHeading)
    formData.append('metaTitle', values.metaTitle)
    formData.append('metaDescription', values.metaDescription)

    // Check if the stateImage is a File (new image) or a string (existing URL)
    if (values.stateImage instanceof File) {
      formData.append('stateImage', values.stateImage)
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_STATE, // Use the correct slug
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error updating state:', error)
    throw error
  }
}

// fetch specific state by ID
export const fetchStateById = async (
  stateId: string
): Promise<FetchSpecificStateResponse> => {
  try {
    const data = await API.get<FetchSpecificStateResponse>({
      slug: `${Slug.GET_STATE}?stateId=${stateId}`, // Interpolating the stateId into the slug
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

// fetch all States
export const fetchAllStates = async (): Promise<FetchStatesResponse> => {
  try {
    const data = await API.get<FetchStatesResponse>({
      slug: Slug.GET_ALL_STATES,
    })

    if (!data) {
      throw new Error('Failed to fetch state data')
    }

    return data
  } catch (error) {
    console.error('Error fetching States:', error)
    throw error
  }
}

// delete specific state by ID
export const deleteState = async (stateId: string) => {
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
