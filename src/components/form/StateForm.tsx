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
import { StateFormType } from '@/types/types'
import { StateFormSchema } from '@/lib/validator'
import { StateFormDefaultValues } from '@/constants'
import { Textarea } from '../ui/textarea'
import Spinner from '../general/Spinner'
import SingleFileUpload from './SingleFileUpload'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../ui/use-toast'
import { addState, updateState } from '@/api/states'

type StateFormProps = {
  type: 'Add' | 'Update'
  formData?: StateFormType | null
}

export default function StateForm({ type, formData }: StateFormProps) {
  const initialValues =
    formData && type === 'Update' ? formData : StateFormDefaultValues

  const navigate = useNavigate()
  const { stateId } = useParams<{ stateId: string }>()

  // 1. Define your form.
  const form = useForm<z.infer<typeof StateFormSchema>>({
    resolver: zodResolver(StateFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof StateFormSchema>) {
    try {
      let data
      if (type === 'Add') {
        data = await addState(values)
      } else if (type === 'Update') {
        data = await updateState(values, stateId as string)
      }

      if (data) {
        toast({
          title: `${type} State successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/locations/manage-states')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Location failed`,
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
            name="stateName"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  State Name
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'Abu Dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add your State Name
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="stateValue"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  State Value<span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="eg: 'abu-dhabi'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    This value will be used for API interaction. Eg: for "Abu
                    Dhabi", value will be "abu-dhabi"
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subHeading"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  State Subheading<span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Input
                      placeholder="Page Sub Heading"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Add the subheading for the state
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stateImage"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="State Image"
                description="Upload a image with a maximum file size of 1mb."
                existingFile={formData?.stateImage}
                maxSizeMB={1}
              />
            )}
          />

          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  Page Meta Title <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
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
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between w-56 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                  Page Meta Description{' '}
                  <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
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
                </div>
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
          {form.formState.isSubmitting ? 'Processing...' : `${type} State`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
