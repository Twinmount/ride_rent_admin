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
import { PromotionFormType } from '@/types/types'
import { PromotionFormDefaultValue } from '@/constants'
import { PromotionFormSchema } from '@/lib/validator'
import Spinner from '../general/Spinner'

import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminContext } from '@/context/AdminContext'
import { deleteLink } from '@/api/links'
import DeleteModal from '../modal/DeleteModal'
import SingleFileUpload from './SingleFileUpload'
import { addPromotion, updatePromotion } from '@/api/promotions'

type PromotionFormProps = {
  type: 'Add' | 'Update'
  formData?: PromotionFormType | null
}

export default function PromotionForm({ type, formData }: PromotionFormProps) {
  const { state } = useAdminContext()

  const initialValues =
    formData && type === 'Update' ? formData : PromotionFormDefaultValue

  const navigate = useNavigate()
  const { promotionId } = useParams<{ promotionId: string }>()
  const queryClient = useQueryClient()

  // 1. Define your form.
  const form = useForm<z.infer<typeof PromotionFormSchema>>({
    resolver: zodResolver(PromotionFormSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PromotionFormSchema>) {
    // console.log('values from form :', values)

    try {
      let data
      if (type === 'Add') {
        data = await addPromotion(values, state.stateId as string)
      } else if (type === 'Update') {
        data = await updatePromotion(values, promotionId as string)
      }

      if (data) {
        toast({
          title: `${type} Promotion successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/manage-promotions')
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: `${type} promotion failed`,
        description: 'Something went wrong',
      })
    }
  }

  const { mutateAsync: deleteLinkMutation, isPending } = useMutation({
    mutationFn: () => deleteLink(promotionId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['links', promotionId],
        exact: true,
      })
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[700px] mx-auto  bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8  shadow-md"
      >
        <div className="flex flex-col gap-5 ">
          {/* type title */}
          <FormField
            control={form.control}
            name="promotionImage"
            render={({ field }) => (
              <SingleFileUpload
                name={field.name}
                label="Promotion Image"
                description="Upload a image with a maximum file size of 3MB"
                existingFile={formData?.promotionImage}
                maxSizeMB={3}
              />
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="promotionLink"
            render={({ field }) => (
              <FormItem className="w-full mb-2 ">
                <FormLabel className="ml-2 ">Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="eg: 'https://example.com'"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormDescription className="ml-2">
                  Provide the link associated with the promotion
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
          {form.formState.isSubmitting ? 'Processing...' : `${type} Promotion`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete link */}
        {type === 'Update' && (
          <DeleteModal
            onDelete={deleteLinkMutation}
            label="Delete"
            title="Delete promotion?"
            description="Are you sure you want to delete this promotion? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/manage-promotions"
          ></DeleteModal>
        )}

        <p className="p-0 m-0 -mt-3 text-xs text-center text-red-500">
          Make sure appropriate state is selected before adding a promotion.
          Currently adding promotion under {state.stateName}
        </p>
      </form>
    </Form>
  )
}
