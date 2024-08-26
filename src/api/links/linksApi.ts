import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificLinkResponse,
  FetchLinksResponse,
} from '@/types/api-types/API-types'

export interface LinkType {
  label: string
  link: string
}

// add link
export const addLink = async (values: LinkType, stateId: string) => {
  try {
    const requestBody = {
      ...values,
      stateId,
    }

    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.ADD_LINK,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error adding links:', error)
    throw error
  }
}

// update link
export const updateLink = async (values: LinkType, linkId: string) => {
  try {
    const requestBody = {
      ...values,
      linkId,
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_LINK,
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating links:', error)
    throw error
  }
}

// fetch specific Link by ID
export const fetchLinkById = async (
  linkId: string
): Promise<FetchSpecificLinkResponse> => {
  try {
    const data = await API.get<FetchSpecificLinkResponse>({
      slug: `${Slug.GET_LINK}?linkId=${linkId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch link data')
    }

    return data
  } catch (error) {
    console.error('Error fetching link:', error)
    throw error
  }
}

// fetch all Links
export const fetchAllLinks = async (urlParams: {
  page: number
  limit: number
  sortOrder: string
  stateId: string
}): Promise<FetchLinksResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: urlParams.page.toString(),
      limit: urlParams.limit.toString(),
      sortOrder: urlParams.sortOrder,
      stateId: urlParams.stateId,
    }).toString()

    const slugWithParams = `${Slug.GET_ALL_LINKS}?${queryParams}`

    const data = await API.get<FetchLinksResponse>({
      slug: slugWithParams,
    })

    if (!data) {
      throw new Error('Failed to fetch link data')
    }

    return data
  } catch (error) {
    console.error('Error fetching links:', error)
    throw error
  }
}

// delete specific link by ID
export const deleteLink = async (linkId: string) => {
  try {
    const data = await API.delete({
      slug: `${Slug.DELETE_LINK}?linkId=${linkId}`,
    })
    return data
  } catch (error) {
    console.error('Error deleting link:', error)
    throw error
  }
}
