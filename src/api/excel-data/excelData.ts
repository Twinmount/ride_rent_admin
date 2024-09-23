import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'

/**
 * Downloads vehicle data as an Excel file based on the selected state.
 *
 * @param stateId - The ID of the selected state.
 * @param stateValue - The value of the selected state.
 * @returns A promise that resolves when the download is complete.
 */
export const downloadVehicleData = async (
  stateId: string,
  stateValue: string
): Promise<void> => {
  try {
    const response = await API.get<Blob>({
      slug: `${Slug.GET_DOWNLOAD_VEHICLE_DATA}?stateId=${stateId}&categoryId=f9f00436-3dcd-4b9e-947a-ecd880e7327e`,
      axiosConfig: { responseType: 'blob' },
    })

    if (response) {
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      const sanitizedStateValue = stateValue.toLowerCase().replace(/\s+/g, '-') // convert to lowercase and replace spaces with dashes
      link.setAttribute('download', `${sanitizedStateValue}-vehicle-data.xlsx`) // Dynamic filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      throw new Error('Failed to download vehicle data')
    }
  } catch (error) {
    console.error('Error downloading vehicle data:', error)
    throw error
  }
}

/**
 * Downloads company data as an Excel file.
 *
 * @returns A promise that resolves when the download is complete.
 */
export const downloadCompanyData = async (): Promise<void> => {
  try {
    const response = await API.get<Blob>({
      slug: Slug.GET_DOWNLOAD_COMPANY_DATA,
      axiosConfig: { responseType: 'blob' },
    })

    if (response) {
      const url = window.URL.createObjectURL(response)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'company-data.xlsx') // Fixed filename for company data
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      throw new Error('Failed to download company data')
    }
  } catch (error) {
    console.error('Error downloading company data:', error)
    throw error
  }
}
