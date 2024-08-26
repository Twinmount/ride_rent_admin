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
import { VehicleTypeFormType } from '@/types/types'
import { VehicleTypeFormSchema } from '@/lib/validator'
import { VehicleTypeFormDefaultValues } from '@/constants'
import Spinner from '../general/Spinner'
import { addVehicleType, updateVehicleType } from '@/api/vehicle-types'
import { toast } from '../ui/use-toast'
import { useNavigate, useParams } from 'react-router-dom'

type VehicleTypeFormProps = {
  type: 'Add' | 'Update'
  category?: string | undefined
  formData?: VehicleTypeFormType | null
}

export default function VehicleTypeForm({
  type,
  category,
  formData,
}: VehicleTypeFormProps) {
  const initialValues =
    formData && type === 'Update' ? formData : VehicleTypeFormDefaultValues

  const { vehicleCategoryId, vehicleTypeId } = useParams<{
    vehicleCategoryId: string
    vehicleTypeId: string
  }>()
  const navigate = useNavigate()

  // 1. Define your form.
  const form = useForm<z.infer<typeof VehicleTypeFormSchema>>({
    resolver: zodResolver(VehicleTypeFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof VehicleTypeFormSchema>) {
    console.log('values', values)

    try {
      let data
      if (type === 'Add') {
        data = await addVehicleType(values, vehicleCategoryId as string)
      } else if (type === 'Update') {
        data = await updateVehicleType(values, vehicleTypeId as string)
      }

      if (data) {
        toast({
          title: `${type} Vehicle type successfully`,
          className: 'bg-yellow text-white',
        })
        if (type === 'Add') {
          navigate(`/manage-types/${vehicleCategoryId}`)
        } else {
          navigate(`/manage-types/`)
        }
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} Vehicle type failed`,
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
            name="name"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Vehicle Type Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'Airport Pickup'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Add your new <span className="font-semibold">{category}</span>{' '}
                  type name.
                </FormDescription>
                <FormMessage className="ml-2" />
              </FormItem>
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Vehicle Type Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'airport_pickup'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  This value will be used for API interaction. Eg: for "Airport
                  Pickup", value will be "airport-pickup"
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
          {form.formState.isSubmitting
            ? 'Submitting...'
            : `${type} ${category} type `}{' '}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
        <p className="p-0 m-0 -mt-3 text-xs text-center text-red-500">
          Make sure appropriate vehicle category is selected before adding a
          type. Currently adding type under {category} vehicle category
        </p>
      </form>
    </Form>
  )
}
