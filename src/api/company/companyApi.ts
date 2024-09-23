import { CompanyListingResponse } from '@/types/types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificCompanyResponse,
  FetchCompaniesResponse,
} from '@/types/api-types/API-types'

export interface CompanyType {
  companyName?: string
  companyLogo?: File | string
  commercialLicense?: File | string
  expireDate?: Date
  regNumber?: string
}

export interface CompanyStatusType {
  approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
  rejectionReason?: string
}

export interface GetAllCompanyType {
  page: number
  limit: number
  sortOrder: string
  newRegistration?: boolean
  edited?: boolean
  approvalStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDER_REVIEW'
  search?: string
}

// add company
export const addCompany = async (values: CompanyType, userId: string) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Append all the fields to the FormData object
    formData.append('userId', userId)

    if (values.companyName) {
      formData.append('companyName', values.companyName)
    }

    if (values.expireDate) {
      formData.append('expireDate', values.expireDate.toISOString())
    }

    if (values.regNumber) {
      formData.append('regNumber', values.regNumber)
    }

    if (values.companyLogo && values.companyLogo instanceof File) {
      formData.append('companyLogo', values.companyLogo)
    }

    if (values.commercialLicense && values.commercialLicense instanceof File) {
      formData.append('commercialLicense', values.commercialLicense)
    }
    // Send the FormData object using the API post method
    const data = await API.post({
      slug: Slug.POST_COMPANY,
      body: formData, // Passing formData instead of JSON object
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type is set
        },
      },
    })

    return data
  } catch (error) {
    console.error('Error adding company:', error)
    throw error
  }
}

// update company
export const updateCompany = async (values: CompanyType, companyId: string) => {
  try {
    // Create a new FormData instance
    const formData = new FormData()

    // Always append the companyId
    formData.append('companyId', companyId)

    // Conditionally append other fields if they are provided
    if (values.companyName) {
      formData.append('companyName', values.companyName)
    }

    if (values.expireDate) {
      formData.append('expireDate', values.expireDate.toISOString())
    }

    if (values.regNumber) {
      formData.append('regNumber', values.regNumber)
    }

    if (values.companyLogo && values.companyLogo instanceof File) {
      formData.append('companyLogo', values.companyLogo)
    }

    if (values.commercialLicense && values.commercialLicense instanceof File) {
      formData.append('commercialLicense', values.commercialLicense)
    }

    // Send the FormData object using the API put method
    const data = await API.put({
      slug: Slug.PUT_COMPANY, // Use the correct slug
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

// update company status
export const updateCompanyStatus = async (
  values: CompanyStatusType,
  companyId: string
) => {
  try {
    // Create the request body, excluding rejectionReason if the status is 'APPROVED'
    const requestBody = {
      ...values,
      companyId,
      ...(values.approvalStatus === 'APPROVED' && {
        rejectionReason: undefined,
      }),
    }

    // Send the request body using the API put method
    const data = await API.put({
      slug: Slug.PUT_COMPANY_STATUS, // Use the correct slug
      body: requestBody,
    })

    return data
  } catch (error) {
    console.error('Error updating state:', error)
    throw error
  }
}

// fetch company by company id
export const getCompany = async (
  companyId: string
): Promise<FetchSpecificCompanyResponse> => {
  try {
    const data = await API.get<FetchSpecificCompanyResponse>({
      slug: `${Slug.GET_COMPANY}?companyId=${companyId}`,
    })

    if (!data) {
      throw new Error('Failed to fetch Company data')
    }

    return data
  } catch (error) {
    console.error('Error fetching Company:', error)
    throw error
  }
}

// fetch all company
export const getAllCompany = async ({
  page,
  limit,
  sortOrder,
  newRegistration,
  edited,
  approvalStatus,
  search,
}: GetAllCompanyType): Promise<FetchCompaniesResponse> => {
  try {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    if (sortOrder) params.append('sortOrder', sortOrder)
    if (search) params.append('search', search)
    if (newRegistration)
      params.append('newRegistration', newRegistration.toString())
    if (edited) params.append('edited', edited.toString())
    if (approvalStatus) params.append('approvalStatus', approvalStatus)

    const queryString = params.toString()
    const url = `${Slug.GET_ALL_COMPANY}?${queryString}`

    const data = await API.get<FetchCompaniesResponse>({ slug: url })

    if (!data) {
      throw new Error('Failed to fetch Company list data')
    }

    return data
  } catch (error) {
    console.error('Error fetching Company list:', error)
    throw error
  }
}

// fetch listings count for vehicles
export const getCompanyListingsCount = async (
  stateId: string
): Promise<CompanyListingResponse> => {
  try {
    const url = `${Slug.GET_COMPANY_LISTINGS_COUNT}/stateId=${stateId}`

    const data = await API.get<CompanyListingResponse>({
      slug: url,
    })

    if (!data) {
      throw new Error('Failed to fetch company listing count data')
    }

    return data
  } catch (error) {
    console.error('Error fetching company listing count data:', error)
    throw error
  }
}
