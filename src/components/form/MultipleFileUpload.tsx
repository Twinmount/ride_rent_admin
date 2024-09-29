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
import { Download, Eye, Trash2, MoreVertical, Upload } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { validateFileSize } from '@/helpers/form'
import ImagePreviewModal from '../modal/ImagePreviewModal'
import { uploadMultipleFiles } from '@/api/file-upload' // Ensure this path is correct
import { GcsFilePaths } from '@/constants/enum'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import PreviewImageComponent from './PreviewImageComponent'
import { Progress } from '../ui/progress'
import ImagePlaceholder from '../ImagePlaceholder'

type MultipleFileUploadProps = {
  name: string
  label: string
  multiple?: boolean
  existingFiles?: string[] // Only paths are needed
  description: string
  maxSizeMB?: number
  setIsFileUploading?: (isUploading: boolean) => void
  bucketFilePath: GcsFilePaths
}

export interface MultipleFileUploadResponse {
  result: {
    message: string
    fileName: string
    path: string[] // Array of paths
  }
  status: string
  statusCode: number
}

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  name,
  label,
  multiple = true,
  existingFiles = [],
  description,
  maxSizeMB = 15,
  setIsFileUploading,
  bucketFilePath,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [files, setFiles] = useState<string[]>(existingFiles) // Only store paths
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Track selected image for preview
  const [progress, setProgress] = useState<number>(0)

  // Determine maximum number of files based on the field name
  const getMaxCount = () => {
    if (name === 'vehiclePhotos') return 8
    if (name === 'commercialLicenses') return 2
    return 0
  }

  const maxCount = getMaxCount()

  // Sync files state with form value
  useEffect(() => {
    setValue(name, files)
  }, [files, setValue, name])

  // Handle file selection and upload
  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || [])
    const validFiles: File[] = []

    // Check remaining capacity
    const remainingLimit = maxCount - files.length
    if (selectedFiles.length > remainingLimit) {
      toast({
        variant: 'destructive',
        title: 'File limit exceeded',
        description: `You can only upload a maximum of ${maxCount} files.`,
      })
      selectedFiles.splice(remainingLimit) // Limit the files
    }

    // Validate file sizes
    for (const file of selectedFiles) {
      if (!validateFileSize(file, maxSizeMB)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file size',
          description: `File ${file.name} exceeds the size limit of ${maxSizeMB}MB`,
        })
        continue
      }
      validFiles.push(file)
    }

    if (validFiles.length === 0) return

    // Set uploading state
    if (setIsFileUploading) setIsFileUploading(true)

    try {
      // Upload files
      const uploadResponse = await uploadMultipleFiles(
        bucketFilePath,
        validFiles,
        (progressEvent) => {
          if (progressEvent.total) {
            const uploadProgress =
              (progressEvent.loaded / progressEvent.total) * 100
            setProgress(uploadProgress)
          }
        }
      )

      // Extract paths from response
      const uploadedPaths = uploadResponse.result.paths

      // Update form state with new paths
      setFiles((prevFiles) => [...prevFiles, ...uploadedPaths])
      clearErrors(name)

      toast({
        title: 'Files uploaded successfully',
        description: `${uploadedPaths.length} file(s) uploaded.`,
        className: 'bg-green-500 text-white',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'File upload failed',
        description: 'Please try again.',
      })
      console.error('Error uploading multiple files:', error)
    } finally {
      // Reset uploading state and progress
      if (setIsFileUploading) setIsFileUploading(false)
      setProgress(0)
      event.target.value = '' // Reset the input
    }
  }

  // Handle file deletion
  const handleDeleteFile = (filePath: string) => {
    setFiles((prevFiles) => prevFiles.filter((path) => path !== filePath))
    toast({
      title: 'File deleted',
      description: 'The selected file has been removed.',
      className: 'bg-red-500 text-white',
    })
  }

  // Handle image preview
  const handlePreviewImage = (filePath: string) => {
    setSelectedImage(filePath)
  }

  // Handle image download
  const handleDownloadImage = (filePath: string) => {
    window.open(filePath, '_blank')
  }

  return (
    <>
      <FormItem className="flex w-full mb-2 max-sm:flex-col">
        <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="flex-col items-start w-full">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  {/* Display uploaded files */}
                  {files.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                      {files.map((filePath, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 overflow-hidden rounded-lg"
                        >
                          <PreviewImageComponent imagePath={filePath} />
                          {/* Dropdown Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="absolute p-1 bg-white rounded-full shadow-md h-fit right-1 top-1">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-28">
                              {/* Delete */}
                              <DropdownMenuItem
                                onClick={() => handleDeleteFile(filePath)}
                              >
                                <Trash2 className="w-5 h-5 mr-2 text-red-600" />
                                Delete
                              </DropdownMenuItem>

                              {/* Preview */}
                              <DropdownMenuItem
                                onClick={() => handlePreviewImage(filePath)}
                              >
                                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                                Preview
                              </DropdownMenuItem>

                              {/* Download */}
                              <DropdownMenuItem
                                onClick={() => handleDownloadImage(filePath)}
                              >
                                <Download className="w-5 h-5 mr-2 text-green-600" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}

                      {/* Render placeholders if needed */}
                      {Array.from({ length: maxCount - files.length }).map(
                        (_, index) => (
                          <ImagePlaceholder
                            key={index}
                            index={index}
                            name={name}
                            labelForVehiclePhotos="upload"
                            labelForCommercialLicensesFront="front"
                            labelForCommercialLicensesBack="back"
                            onFileChange={handleFilesChange}
                          />
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            />
          </FormControl>
          <FormDescription className="ml-2">{description}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  )
}

export default MultipleFileUpload
