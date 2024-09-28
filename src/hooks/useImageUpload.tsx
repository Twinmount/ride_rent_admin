import { useEffect, useState } from 'react'
import { deleteFile } from '@/api/file-upload'

type ImageTracking = {
  add: string[]
  delete: string[]
}

const useImageUpload = (fieldName: string) => {
  const [images, setImages] = useState<ImageTracking>({ add: [], delete: [] })

  // Initialize from localStorage if there are any previously tracked images
  useEffect(() => {
    try {
      const savedImages = localStorage.getItem(fieldName)
      if (savedImages) {
        setImages(JSON.parse(savedImages))
      }
    } catch (error) {
      console.error('Failed to retrieve or parse localStorage data:', error)
    }
  }, [fieldName])

  // Store images in localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(fieldName, JSON.stringify(images))
    } catch (error) {
      console.error('Failed to store data in localStorage:', error)
    }
  }, [images, fieldName])

  // Handle adding an image
  const addImage = (path: string) => {
    setImages((prev) => ({
      ...prev,
      add: [...prev.add, path],
    }))
  }

  // Handle deleting an image
  const trackDeletedImage = (path: string) => {
    setImages((prev) => ({
      ...prev,
      delete: [...prev.delete, path],
    }))
  }

  // Clean up images when the user leaves the page without submission
  const cleanUpUnsubmittedImages = async () => {
    const { add } = images
    for (const path of add) {
      console.log('cleanUpUnsubmittedImages called for ' + path)
      try {
        await deleteFile(path)
      } catch (error) {
        console.error(`Failed to delete image at path ${path}:`, error)
      }
    }
    clearTracking()
  }

  // Clear the tracking object and localStorage
  const clearTracking = () => {
    setImages({ add: [], delete: [] })
    localStorage.removeItem(fieldName)
  }

  return {
    addImage,
    trackDeletedImage,
    cleanUpUnsubmittedImages,
    clearTracking,
    images,
  }
}

export default useImageUpload
