import React, { useState, useEffect } from 'react'

import { useFormContext, Controller } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload, Eye, Download, Trash2 } from 'lucide-react' // Added Download icon
import { toast } from '@/components/ui/use-toast'
import ImagePreviewModal from '../modal/ImagePreviewModal'
import { uploadSingleFile, getSingleImage } from '@/api/file-upload'
import { GcsFilePaths } from '@/constants/enum'
import { Skeleton } from '../ui/skeleton'
import Spinner from '../general/Spinner'
import useImageUpload from '@/hooks/useImageUpload'
import useBeforeUnload from '@/hooks/useBeforeUnload'
import { useNavigate } from 'react-router-dom'

type SingleFileUploadProps = {
  name: string
  label: string
  description: React.ReactNode
  existingFile?: string | null
  isDisabled?: boolean
  maxSizeMB?: number
  isDownloadable?: boolean
}

const SingleFileUpload = ({
  name,
  label,
  description,
  existingFile = null,
  isDisabled = false,
  maxSizeMB = 5,
  isDownloadable = false,
}: SingleFileUploadProps) => {
  const { control, setValue, clearErrors } = useFormContext()
  const navigate = useNavigate()
  const [previewURL, setPreviewURL] = useState<string | null>(existingFile)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Use the custom image upload hook for managing localStorage
  const { addImage, trackDeletedImage, cleanUpUnsubmittedImages } =
    useImageUpload(name)

  // BeforeUnload Hook: Trigger cleanup when the user navigates away
  useBeforeUnload(
    'You have unsaved changes, are you sure you want to leave?',
    cleanUpUnsubmittedImages
  )

  useEffect(() => {
    if (!previewURL && existingFile) {
      setPreviewURL(existingFile)
      setValue(name, existingFile)
    }
  }, [existingFile, setValue, name, previewURL])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        toast({
          variant: 'destructive',
          title: `Image size exceeds ${maxSizeMB} MB`,
        })
        return
      }

      setIsLoading(true)
      try {
        const uploadResponse = await uploadSingleFile(GcsFilePaths.IMAGE, file)
        const uploadedFilePath = uploadResponse.result.path

        addImage(uploadedFilePath) // Track image in localStorage

        setValue(name, uploadedFilePath)

        const imageResponse = await getSingleImage(uploadedFilePath)
        const imageURL = imageResponse.result.url

        setPreviewURL(imageURL)
        clearErrors(name)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'File upload failed',
          description: 'Please try again.',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDeleteImage = () => {
    if (previewURL) {
      trackDeletedImage(previewURL) // Track deleted image
      setPreviewURL(null)
      setValue(name, null)
    }
  }

  const handlePreviewImage = () => {
    if (previewURL) {
      setPreviewImage(previewURL) // Set selected image for preview modal
    }
  }

  const handleDownloadImage = () => {
    if (previewURL) {
      window.open(previewURL, '_blank') // Open the image in a new tab
    }
  }

  return (
    <>
      <FormItem className="flex w-full mb-2 max-sm:flex-col">
        <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="flex-col items-start w-full">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-upload-${name}`}
                    disabled={isDisabled || isLoading}
                  />
                  <div className="flex items-center gap-4 mt-2">
                    {isLoading ? (
                      <div className="relative flex items-center justify-center w-24 h-24 cursor-wait">
                        <Skeleton className="w-full h-full bg-gray-300 rounded-xl" />
                        <div className="absolute z-10">
                          <Spinner color="text-yellow" />
                        </div>
                      </div>
                    ) : previewURL ? (
                      <div className="relative w-24 group/box">
                        <img
                          src={previewURL}
                          alt="Preview"
                          className="object-cover w-full h-24 rounded-md"
                        />
                        <div className="absolute top-0 bottom-0 left-0 right-0 space-x-2">
                          {!isDisabled && (
                            <>
                              <button
                                type="button"
                                className="absolute p-1 bg-white rounded-full shadow-md h-fit right-1 top-1"
                                onClick={handleDeleteImage}
                                disabled={isDisabled || isLoading}
                              >
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </button>

                              {/* Eye Icon for previewing the image */}
                              <button
                                type="button"
                                className="absolute p-1 bg-white rounded-full shadow-md h-fit left-1 bottom-1"
                                onClick={handlePreviewImage}
                                disabled={isLoading}
                              >
                                <Eye className="w-5 h-5 text-blue-600" />
                              </button>

                              {/* Download button if isDownloadable is true */}
                              {isDownloadable && (
                                <button
                                  type="button"
                                  className="absolute p-1 bg-white rounded-full shadow-md h-fit right-1 bottom-1"
                                  onClick={handleDownloadImage}
                                  disabled={isLoading}
                                >
                                  <Download className="w-5 h-5 text-green-600" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-upload-${name}`}
                        className="w-24 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center w-24 h-24 border rounded-lg cursor-pointer bg-gray-50">
                          <Upload size={24} className="text-yellow" />
                          <span className="text-sm text-yellow">Upload</span>
                        </div>
                      </label>
                    )}
                  </div>
                </>
              )}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          selectedImage={previewImage}
          setSelectedImage={setPreviewImage}
        />
      )}
    </>
  )
}

export default SingleFileUpload
