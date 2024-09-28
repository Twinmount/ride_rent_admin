import {
  DeleteSingleImageResponse,
  GetSingleImageResponse,
  SingleFileUploadResponse,
} from '@/types/api-types/API-types'
import { Slug } from '../Api-Endpoints'
import { API } from '../ApiService'
import { GcsFilePaths } from '@/constants/enum' // Import the enum where it's defined

// Single File Upload Function
export const uploadSingleFile = async (
  fileCategory: GcsFilePaths,
  file: File
): Promise<SingleFileUploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('fileCategory', fileCategory)
    formData.append('file', file)

    const response = await API.post<SingleFileUploadResponse>({
      slug: Slug.POST_SINGLE_FILE,
      body: formData,
      axiosConfig: {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    })

    if (!response) {
      throw new Error('Failed to post single image')
    }

    return response // Response will contain the image path
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const getSingleImage = async (
  path: string
): Promise<GetSingleImageResponse> => {
  try {
    const response = await API.get<GetSingleImageResponse>({
      slug: `${Slug.GET_SINGLE_FILE}?path=${path}`,
    })

    if (!response) {
      throw new Error('Failed to delete image')
    }

    return response
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// File delete function
export const deleteFile = async (
  path: string
): Promise<DeleteSingleImageResponse> => {
  try {
    const response = await API.delete<DeleteSingleImageResponse>({
      slug: `${Slug.DELETE_SINGLE_FILE}?path=${path}`,
    })

    if (!response) {
      throw new Error('Failed to delete image')
    }

    return response
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}
