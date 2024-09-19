import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import 'react-datepicker/dist/react-datepicker.css'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CompanyStatusFormDefaultValues } from '@/constants'
import { CompanyStatusFormSchema } from '@/lib/validator'
import { CompanyStatusFormType } from '@/types/types'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { CompanyStatusType, updateCompanyStatus } from '@/api/company'
import { useState } from 'react'
import Spinner from '../general/Spinner'

type CompanyStatusProps = {
  formData?: CompanyStatusFormType | null
}

type StatusTypes = 'PENDING' | 'APPROVED' | 'REJECTED'

export default function CompanyStatusForm({ formData }: CompanyStatusProps) {
  const navigate = useNavigate()
  const { companyId } = useParams<{ companyId: string }>()
  const [status, setStatus] = useState<StatusTypes>(
    formData?.approvalStatus || 'PENDING'
  )

  const initialValues = formData ? formData : CompanyStatusFormDefaultValues

  // creating form
  const form = useForm<z.infer<typeof CompanyStatusFormSchema>>({
    resolver: zodResolver(CompanyStatusFormSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof CompanyStatusFormSchema>) {
    try {
      const { approvalStatus, rejectionReason } = values

      if (approvalStatus === 'PENDING') {
        form.setError('approvalStatus', {
          type: 'manual',
          message:
            'Approval status cannot be pending. Please choose Approved or Rejected.',
        })
        return
      }

      const requestBody: CompanyStatusType = {
        approvalStatus,
      }

      // Append rejectionReason only if the approvalStatus is 'REJECTED'
      if (approvalStatus === 'REJECTED') {
        if (!rejectionReason) {
          toast({
            variant: 'destructive',
            title: `Rejection reason is required`,
            description: 'Please provide a reason for rejection.',
          })
          return
        }
        requestBody.rejectionReason = rejectionReason
      }

      const data = await updateCompanyStatus(requestBody, companyId as string)

      if (data) {
        toast({
          title: `Company status updated successfully`,
          className: 'bg-yellow text-white',
        })
        navigate('/registrations')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `Status update failed`,
        description: 'Something went wrong',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 max-w-[800px] mx-auto bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8 border-t shadow-md"
      >
        <div className="flex flex-col w-full gap-5 p-3 mx-auto rounded-3xl">
          {/* Approval Status */}
          <FormField
            control={form.control}
            name="approvalStatus"
            render={({ field }) => (
              <FormItem className="flex w-full mb-2 max-sm:flex-col">
                <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                  Approval Status <span className="mr-5 max-sm:hidden">:</span>
                </FormLabel>
                <div className="flex-col items-start w-full">
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {status}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuRadioGroup
                          value={status}
                          onValueChange={(value: string) => {
                            setStatus(value as StatusTypes)
                            field.onChange(value)
                          }}
                        >
                          <DropdownMenuRadioItem value="PENDING">
                            Pending
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="APPROVED">
                            Approved
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="REJECTED">
                            Rejected
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Rejection Reason */}
          {status === 'REJECTED' && (
            <FormField
              control={form.control}
              name="rejectionReason"
              render={({ field }) => (
                <FormItem className="flex w-full mb-2 max-sm:flex-col">
                  <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
                    Rejection Reason{' '}
                    <span className="mr-5 max-sm:hidden">:</span>
                  </FormLabel>
                  <div className="flex-col items-start w-full">
                    <FormControl>
                      <Input
                        placeholder="Enter the reason for rejection"
                        {...field}
                        className="input-field"
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Provide the rejection reason to inform
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {'Update Company Status'}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
