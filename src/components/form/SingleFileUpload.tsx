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
import { Upload, X } from 'lucide-react'
import { validateFileSize } from '@/helpers/form'
import { toast } from '@/components/ui/use-toast'

type SingleFileUploadProps = {
  name: string
  label: string
  description: string
  maxSizeMB?: number
  existingFile?: string | null
  isDisabled?: boolean
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  name,
  label,
  description,
  maxSizeMB = 5,
  existingFile = null,
  isDisabled = false,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [previewURL, setPreviewURL] = useState<string | null>(existingFile)

  useEffect(() => {
    // Set the preview to the existing URL only if no new file has been selected
    if (!previewURL && existingFile) {
      setPreviewURL(existingFile) // Set the existing file URL as preview
      setValue(name, existingFile) // Store the existing URL as the form value (initial state)
    }
  }, [existingFile, setValue, name, previewURL])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!validateFileSize(file, maxSizeMB)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file size',
          description: `File ${file.name} exceeds the size limit of ${maxSizeMB}MB`,
        })
        return
      }

      // Set preview for the new file and store the file in form state
      setPreviewURL(URL.createObjectURL(file)) // Set the new file preview
      setValue(name, file) // Set the new file in the form state
      clearErrors(name)
    }
  }

  const handleDeleteImage = () => {
    setPreviewURL(null)
    setValue(name, null) // Clear the file from the form state
  }

  return (
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
                  onChange={(e) => {
                    handleFileChange(e) // Handle file change logic here
                  }}
                  className="hidden"
                  id={`file-upload-${name}`}
                  disabled={isDisabled}
                />
                <div className="flex items-center gap-4 mt-2">
                  {previewURL ? (
                    <div className="relative">
                      <img
                        src={previewURL} // Show the preview image, either from the URL or new file
                        alt="Preview"
                        className="object-contain w-full h-24 rounded-md"
                      />
                      {!isDisabled && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                          onClick={handleDeleteImage}
                          disabled={isDisabled}
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-upload-${name}`}
                      className="w-full cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-full h-16 gap-2 border rounded-lg bg-gray-50">
                        <span
                          className={`text-lg ${
                            isDisabled ? 'opacity-40' : 'text-yellow'
                          }`}
                        >
                          Upload
                        </span>
                        <Upload
                          size={24}
                          className={`${
                            isDisabled ? 'opacity-30' : 'text-yellow'
                          }`}
                        />
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
  )
}

export default SingleFileUpload
