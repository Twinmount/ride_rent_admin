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

import DeleteModal from '../modal/DeleteModal'
import {
  addPromotion,
  deletePromotion,
  updatePromotion,
} from '@/api/promotions'
import { useState } from 'react'
import { GcsFilePaths } from '@/constants/enum'
import { deleteMultipleFiles } from '@/helpers/form'
import PromotionFileUpload from './PromotionsFileUpload'

type PromotionFormProps = {
  type: 'Add' | 'Update'
  formData?: PromotionFormType | null
}

export default function PromotionForm({ type, formData }: PromotionFormProps) {
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [deletedImages, setDeletedImages] = useState<string[]>([])

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

    try {
      let data
      if (type === 'Add') {
        data = await addPromotion(values, state.stateId as string)
      } else if (type === 'Update') {
        data = await updatePromotion(values, promotionId as string)
      }

      if (data) {
      
        await deleteMultipleFiles(deletedImages) // Call
      }

      if (data) {
        toast({
          title: `${type} Promotion successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/marketing/promotions')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} promotion failed`,
        description: 'Something went wrong',
      })
    }
  }

  const { mutateAsync: deletePromotionMutation, isPending } = useMutation({
    mutationFn: () => deletePromotion(promotionId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['promotions', state],
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
        <div className="flex flex-col gap-5">
          {/* type title */}
          <FormField
            control={form.control}
            name="promotionImage"
            render={({ field }) => (
              <PromotionFileUpload
                name={field.name}
                label="Promotion Image"
                description="Upload an image or GIF with a maximum file size of 5MB. Vertical (portrait) aspect ratio is preferred"
                existingFile={formData?.promotionImage}
                maxSizeMB={5}
                setIsFileUploading={setIsFileUploading}
                bucketFilePath={GcsFilePaths.IMAGE}
                setDeletedImages={setDeletedImages}
              />
            )}
          />

          {/* type value */}
          <FormField
            control={form.control}
            name="promotionLink"
            render={({ field }) => (
              <FormItem className="flex mb-2 w-full max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 w-56 text-base max-sm:w-fit lg:text-lg">
                  Link <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>

                <div className="flex-col items-start w-full">
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
          {form.formState.isSubmitting ? 'Processing...' : `${type} Promotion`}
          {form.formState.isSubmitting && <Spinner />}
        </Button>

        {/* delete link */}
        {type === 'Update' && (
          <DeleteModal
            onDelete={deletePromotionMutation}
            label="Delete"
            title="Delete promotion?"
            description="Are you sure you want to delete this promotion? "
            confirmText="Delete"
            cancelText="Cancel"
            isLoading={isPending || form.formState.isSubmitting}
            navigateTo="/marketing/promotions"
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
