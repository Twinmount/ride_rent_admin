import { CompanyListingResponse } from '@/types/types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import {
  FetchSpecificCompanyResponse,
  FetchCompaniesResponse,
} from '@/types/api-types/API-types'

export interface CompanyType {
  companyName?: string
  companyLogo?: string
  commercialLicense?: string
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

export interface CompanyType {
  companyName?: string
  companyLogo?: string
  commercialLicense?: string
  expireDate?: Date
  regNumber?: string
}

export const addCompany = async (values: CompanyType, userId: string) => {
  try {
    const data = await API.post({
      slug: Slug.POST_COMPANY,
      body: {
        userId: userId,
        companyName: values.companyName,
        expireDate: values.expireDate
          ? values.expireDate.toISOString()
          : undefined,
        regNumber: values.regNumber,
        companyLogo: values.companyLogo, // Assuming this is a URL or string
        commercialLicense: values.commercialLicense, // Assuming this is a URL or string
      },
    })

    return data
  } catch (error) {
    console.error('Error adding company:', error)
    throw error
  }
}

export const updateCompany = async (values: CompanyType, companyId: string) => {
  try {
    const data = await API.put({
      slug: Slug.PUT_COMPANY,
      body: {
        companyId: companyId,
        companyName: values.companyName,
        expireDate: values.expireDate
          ? values.expireDate.toISOString()
          : undefined,
        regNumber: values.regNumber,
        companyLogo: values.companyLogo, // Assuming this is a URL or string
        commercialLicense: values.commercialLicense, // Assuming this is a URL or string
      },
    })

    return data
  } catch (error) {
    console.error('Error updating company:', error)
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
export const getCompanyListingsCount =
  async (): Promise<CompanyListingResponse> => {
    try {
      const url = `${Slug.GET_COMPANY_LISTINGS_COUNT}`

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
