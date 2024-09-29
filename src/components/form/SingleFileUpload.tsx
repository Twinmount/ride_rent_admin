import React, { useState, useEffect, useCallback } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload, Eye, Download, Trash2, MoreVertical } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import ImagePreviewModal from '../modal/ImagePreviewModal'
import { uploadSingleFile, getSingleImage } from '@/api/file-upload'
import { GcsFilePaths } from '@/constants/enum'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import PreviewImageComponent from './PreviewImageComponent'
import { Progress } from '../ui/progress'

type SingleFileUploadProps = {
  name: string
  label: string
  description: React.ReactNode
  existingFile?: string | null
  isDisabled?: boolean
  maxSizeMB?: number
  isDownloadable?: boolean
  setIsFileUploading?: (isUploading: boolean) => void
  bucketFilePath: GcsFilePaths
}

const SingleFileUpload = ({
  name,
  label,
  description,
  existingFile = null,
  isDisabled = false,
  maxSizeMB = 5,
  isDownloadable = false,
  setIsFileUploading,
  bucketFilePath,
}: SingleFileUploadProps) => {
  const { control, setValue, clearErrors } = useFormContext()

  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(existingFile)
  const [progress, setProgress] = useState<number>(0)

  // Helper function to fetch the image preview URL from the path
  const fetchImagePreviewURL = useCallback(async (filePath: string) => {
    try {
      const imageResponse = await getSingleImage(filePath)
      const imageURL = imageResponse.result.url
      setPreviewURL(imageURL) // Set the preview URL for modal and download
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to fetch image.' })
    }
  }, [])

  // Sync loading state with parent if necessary
  useEffect(() => {
    if (setIsFileUploading) {
      setIsFileUploading(isLoading)
    }
  }, [isLoading, setIsFileUploading])

  // Fetch image URL if `existingFile` is present (on Update)
  useEffect(() => {
    if (existingFile) {
      setImagePath(existingFile)
      setValue(name, existingFile)
      fetchImagePreviewURL(existingFile)
    }
  }, [existingFile, setValue, name, fetchImagePreviewURL])

  // Handle file upload and setting values
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
        const uploadResponse = await uploadSingleFile(
          bucketFilePath,
          file,
          (progressEvent) => {
            if (progressEvent.total) {
              const progress =
                (progressEvent.loaded / progressEvent.total) * 100
              setProgress(progress)
            }
          }
        )
        const uploadedFilePath = uploadResponse.result.path

        setValue(name, uploadedFilePath)
        setImagePath(uploadedFilePath) // Set the new image path

        // Fetch the preview URL for the uploaded file
        fetchImagePreviewURL(uploadedFilePath)
        clearErrors(name)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'File upload failed',
          description: 'Please try again.',
        })
      } finally {
        setIsLoading(false)
        setProgress(0)
      }
    }
  }

  // Handle image deletion
  const handleDeleteImage = () => {
    const fileInput = document.getElementById(
      `file-upload-${name}`
    ) as HTMLInputElement
    if (fileInput) {
      fileInput.value = '' // Clear the file input field
    }

    setImagePath(null) // Remove image path for PreviewImageComponent
    setPreviewURL(null) // Reset the preview URL
    setValue(name, null) // Remove the value from form
  }

  // Handle image preview in modal
  const handlePreviewImage = () => {
    if (previewURL) {
      setPreviewImage(previewURL) // Set the image for modal preview
    }
  }

  // Handle image download
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
                    {imagePath ? (
                      <div className="relative w-24 group/box">
                        {/* Use PreviewImageComponent to handle image fetching */}
                        <PreviewImageComponent imagePath={imagePath} />
                        <div className="absolute top-0 bottom-0 left-0 right-0 space-x-2">
                          {!isDisabled && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                className="border-none outline-none ring-0"
                              >
                                <button className="absolute p-1 bg-white rounded-full shadow-md h-fit right-1 top-1">
                                  <MoreVertical className="w-5 h-5 text-gray-600" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-28">
                                {/* Delete */}
                                <DropdownMenuItem
                                  onClick={handleDeleteImage}
                                  disabled={isDisabled || isLoading}
                                >
                                  <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                                  Delete
                                </DropdownMenuItem>

                                {/* Preview */}
                                <DropdownMenuItem
                                  onClick={handlePreviewImage}
                                  disabled={isLoading}
                                >
                                  <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                  Preview
                                </DropdownMenuItem>

                                {/* Download */}
                                {isDownloadable && (
                                  <DropdownMenuItem
                                    onClick={handleDownloadImage}
                                    disabled={isLoading}
                                  >
                                    <Download className="w-5 h-5 mr-2 text-green-600" />
                                    Download
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-upload-${name}`}
                        className="relative flex justify-center w-24 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center w-24 h-24 border rounded-lg cursor-pointer bg-gray-50">
                          <Upload size={24} className="text-yellow" />
                          <span className="text-sm text-yellow">Upload</span>
                        </div>

                        {/* progress bar */}
                        {isLoading && (
                          <div className="absolute w-[99%] mx-auto mt-2 bottom-1">
                            {/* progress bar */}

                            <div className="w-full mt-2">
                              <Progress value={progress} className="w-[95%] " />
                            </div>
                          </div>
                        )}
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
