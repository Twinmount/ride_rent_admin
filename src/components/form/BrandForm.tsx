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
import { Textarea } from '../ui/textarea'
import Spinner from '../general/Spinner'
import { addBrand, updateBrand } from '@/api/brands'
import { toast } from '../ui/use-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import SingleFileUpload from './SingleFileUpload'
import VehicleCategoryDropdown from './VehicleCategoryDropdown'

type BrandFormProps = {
  type: 'Add' | 'Update'
  formData?: BrandFormType | null
}

export default function BrandForm({ type, formData }: BrandFormProps) {
  const initialValues =
    formData && type === 'Update' ? formData : BrandFormDefaultValues

  const navigate = useNavigate()

  const { vehicleCategoryId, brandId } = useParams<{
    vehicleCategoryId: string
    brandId: string
  }>()

  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof BrandFormSchema>>({
    resolver: zodResolver(BrandFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof BrandFormSchema>) {
    console.log('values from form :', values)

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
      console.log(error)
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
        <div className="flex flex-col gap-5 r ">
          {/* type title */}
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Brand Name</FormLabel>
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
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="brandValue"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Brand Value</FormLabel>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleCategoryId"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Vehicle Category</FormLabel>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subHeading"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Brand Subheading</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Page Sub Heading"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Add the subheading for the brand
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
          <div className="flex max-sm:flex-col gap-x-10">
            <FormField
              control={form.control}
              name="brandLogo"
              render={({ field }) => (
                <SingleFileUpload
                  name={field.name}
                  label="Brand Logo"
                  description="Upload a image with a maximum file size of 300KB. The image should have dimensions not exceeding 500x500 pixels"
                  existingFile={formData?.brandLogo}
                  maxSizeMB={0.3}
                />
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="ml-2 ">Page Meta Title </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Meta Tag"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Meta title for the page
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="ml-2 ">Page Meta Description </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Meta Description"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Meta description for the page
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
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
