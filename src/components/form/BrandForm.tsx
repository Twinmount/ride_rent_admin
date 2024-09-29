import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BrandFormType } from '@/types/types'
import { BrandFormSchema } from '@/lib/validator'
import { BrandFormDefaultValues } from '@/constants'
import Spinner from '../general/Spinner'
import { addBrand, updateBrand } from '@/api/brands'
import { toast } from '../ui/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import SingleFileUpload from './SingleFileUpload'
import VehicleCategoryDropdown from './VehicleCategoryDropdown'
import { useState } from 'react'
import { GcsFilePaths } from '@/constants/enum'

type BrandFormProps = {
  type: 'Add' | 'Update'
  formData?: BrandFormType | null
}

export default function BrandForm({ type, formData }: BrandFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false)

  const initialValues =
    formData && type === 'Update' ? formData : BrandFormDefaultValues

  const navigate = useNavigate()

  const { vehicleCategoryId, brandId } = useParams<{
    vehicleCategoryId: string
    brandId: string
  }>()

  // 1. Define your form.
  const form = useForm<z.infer<typeof BrandFormSchema>>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BrandFormSchema>) {
    if (isFileUploading) {
      toast({
        title: 'File Upload in Progress',
        description:
          'Please wait until the file upload completes before submitting the form.',
        duration: 3000,
        className: 'bg-orange',
      })
      return
    }

    console.log('brand values : ', values)

    return
    try {
      let data
      if (type === 'Add') {
        data = await addBrand(values, vehicleCategoryId as string)
      } else if (type === 'Update') {
        data = await updateBrand(values, brandId as string)
      }

      if (data) {
        toast({
          title: `${type} Brand successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/manage-brands')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Brand failed`,
        description: 'Something went wrong',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[700px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
      >
        <div className="flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  Brand Name <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Land Rover'"
                      {...field}
                      className={`input-field`}
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add your Brand Name
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="brandValue"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  Brand Value <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'land-rover'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This value will be used for API interaction. Eg: for "Land
                    Rover", value will be "land-rover"
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  Vehicle Category <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <VehicleCategoryDropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                      placeholder=" category"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Category of the vehicle
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandLogo"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Brand Logo"
                description="Upload a image with a maximum file size of 300KB. The image should have dimensions not exceeding 500x500 pixels"
                existingFile={formData?.brandLogo}
                maxSizeMB={1}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.LOGOS}
              />
            )}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? 'Submitting...' : `${type} Brand `}{' '}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
