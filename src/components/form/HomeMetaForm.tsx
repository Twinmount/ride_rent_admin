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

import { Button } from '@/components/ui/button'
import { HomeMetaFormType } from '@/types/types'
import { HomeMetaFormDefaultValue } from '@/constants'
import { HomeMetaFormSchema } from '@/lib/validator'
import Spinner from '../general/Spinner'

import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { addHomeMetaData, updateHomeMetaData } from '@/api/meta-data'

import { useState } from 'react'
import { Textarea } from '../ui/textarea'
import StatesDropdown from './StatesDropdown'

type HomeMetaFormProps = {
  type: 'Add' | 'Update'
  formData?: HomeMetaFormType | null
}

export default function HomeMetaForm({ type, formData }: HomeMetaFormProps) {
  const initialValues =
    formData && type === 'Update' ? formData : HomeMetaFormDefaultValue

  const navigate = useNavigate()
  const { metaDataId } = useParams<{ metaDataId: string }>()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof HomeMetaFormSchema>>({
    resolver: zodResolver(HomeMetaFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof HomeMetaFormSchema>) {
    console.log('values from form :', values)

    try {
      let data
      if (type === 'Add') {
        data = await addHomeMetaData(values)
      } else if (type === 'Update') {
        data = await updateHomeMetaData(values, metaDataId as string)
      }

      if (data) {
        toast({
          title: `${type} Meta Data successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/manage-meta-data')
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} meta data failed`,
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
        <div className="flex flex-col gap-5 ">
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  State <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <StatesDropdown
                      onChangeHandler={(value) => {
                        field.onChange(value)
                      }}
                      value={initialValues.stateId}
                      placeholder="state"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Choose your state
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col ">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                  Meta Title <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <Textarea
                      placeholder="eg: 'https://example.com'"
                      {...field}
                      className="input-field"
                    />
                  </FormControl>
                  <FormDescription className="ml-2">
                    Provide the meta title for the selected state home page
                  </FormDescription>
                  <FormMessage className="ml-2" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => {
              const [isFocused, setIsFocused] = useState(false) // To manage focus state
              const [charCount, setCharCount] = useState(
                field.value?.length || 0
              ) // To track character count

              const handleFocus = () => setIsFocused(true)
              const handleBlur = () => setIsFocused(false)
              const handleInputChange = (
                e: React.ChangeEvent<HTMLTextAreaElement>
              ) => {
                setCharCount(e.target.value.length)
                field.onChange(e)
              }

              return (
                <FormItem className="flex w-full mb-2 max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base h-fit w-52 min-w-52 lg:text-lg">
                    Meta Description
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div
                    className="flex-col items-start w-full"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <FormControl>
                      <Textarea
                        placeholder="Meta Description"
                        {...field}
                        className={`textarea rounded-2xl transition-all duration-300 ${
                          isFocused ? 'h-96' : 'h-24'
                        }`} // Dynamic height
                        onChange={handleInputChange} // Handle change to track character count
                      />
                    </FormControl>
                    <FormDescription className="w-full mt-1 ml-2 flex-between">
                      <span className="w-full max-w-[90%]">
                        Provide meta description.5000 characters max.
                      </span>{' '}
                      <span className="ml-auto"> {`${charCount}/5000`}</span>
                    </FormDescription>
                    <FormMessage className="ml-2 " />
                  </div>
                </FormItem>
              )
            }}
          />
        </div>

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? 'Processing...' : `${type} Home Meta`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
