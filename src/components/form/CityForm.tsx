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
import { CityFormType } from '@/types/types'
import { CityFormSchema } from '@/lib/validator'
import { CityFormDefaultValues } from '@/constants'
import Spinner from '../general/Spinner'

import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../ui/use-toast'
import DeleteModal from '../modal/DeleteModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCity, deleteCity, updateCity } from '@/api/cities'
import { useAdminContext } from '@/context/AdminContext'

type CityFormProps = {
  type: 'Add' | 'Update'
  formData?: CityFormType | null
}

export default function CityForm({ type, formData }: CityFormProps) {
  const initialValues =
    formData && type === 'Update' ? formData : CityFormDefaultValues

  const { cityId } = useParams<{ cityId: string }>()

  const navigate = useNavigate()
  const { state } = useAdminContext()

  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof CityFormSchema>>({
    resolver: zodResolver(CityFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof CityFormSchema>) {
    console.log('values from form :', values)

    try {
      let data
      if (type === 'Add') {
        data = await addCity(values, state.stateId as string)
      } else if (type === 'Update') {
        data = await updateCity(values, cityId as string)
      }

      if (data) {
        toast({
          title: `${type} City successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/locations/manage-cities')
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} City failed`,
        description: 'Something went wrong',
      })
    }
  }

  const { mutateAsync: deleteCityMutation, isPending } = useMutation({
    mutationFn: () => deleteCity(cityId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'], exact: true })
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[700px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
      >
        {/* type title */}
        <FormField
          control={form.control}
          name="cityName"
          render={({ field }) => (
            <FormItem className="w-full mb-2 ">
              <FormLabel className="ml-2 ">City Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg: 'Al Bateen'"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormDescription className="ml-2">
                Add your City Name
              </FormDescription>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />

        {/* type value */}
        <FormField
          control={form.control}
          name="cityValue"
          render={({ field }) => (
            <FormItem className="w-full mb-2 ">
              <FormLabel className="ml-2 ">City Value</FormLabel>
              <FormControl>
                <Input
                  placeholder="eg: 'al-bateen'"
                  {...field}
                  className="input-field"
                />
              </FormControl>
              <FormDescription className="ml-2">
                This value will be used for API interaction. Eg: for "Abu
                Dhabi", value will be "abu-dhabi"
              </FormDescription>
              <FormMessage className="ml-2" />
            </FormItem>
          )}
        />

        {/* submit  */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting || isPending}
          className="w-full flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-yellow/90"
        >
          {form.formState.isSubmitting ? 'Processing...' : `${type} City`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete modal button only on "Update" */}
        {type === 'Update' && (
          <DeleteModal
            onDelete={deleteCityMutation}
            label="Delete"
            title="Delete City"
            description="Are you sure you want to delete this city? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/locations/manage-cities"
          ></DeleteModal>
        )}
      </form>
    </Form>
  )
}
