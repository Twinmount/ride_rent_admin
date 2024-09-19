import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'
import { useQueryClient } from '@tanstack/react-query'
import CompanyStatusDropdown from './CompanyStatusDropdown'

// Define the form schema using Zod
const formSchema = z
  .object({
    approvalStatus: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
    rejectionReason: z
      .string()
      .max(120, 'Rejection reason must be at most 120 characters long.')
      .optional(),
  })
  .refine(
    (data) => {
      if (data.approvalStatus === 'REJECTED') {
        // Ensure rejectionReason is provided and not empty when status is REJECTED
        return data.rejectionReason && data.rejectionReason.trim() !== ''
      }
      return true
    },
    {
      message: 'Rejection reason is required when status is REJECTED.',
      path: ['rejectionReason'],
    }
  )

// Define the prop types
type CompanyStatusModalProps = {
  companyName: string
  isOpen: boolean
  rejectionReason: string
  currentStatus: 'APPROVED' | 'REJECTED' | 'PENDING'
  onClose: () => void
  onSubmit: (values: {
    approvalStatus: 'APPROVED' | 'REJECTED' | 'PENDING'
    rejectionReason?: string
  }) => Promise<void>
}

export default function CompanyStatusModal({
  companyName,
  isOpen,
  currentStatus,
  rejectionReason,
  onClose,
  onSubmit,
}: CompanyStatusModalProps) {
  const [status, setStatus] = useState<'APPROVED' | 'REJECTED' | 'PENDING'>(
    currentStatus
  )

  const [charCount, setCharCount] = useState<number>(0)

  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approvalStatus: currentStatus,
      rejectionReason,
    },
  })

  const handleFormSubmit = async (values: {
    approvalStatus: 'APPROVED' | 'REJECTED' | 'PENDING'
    rejectionReason?: string
  }) => {
    // Check if the form values have changed
    if (values.approvalStatus === currentStatus) {
      toast({
        variant: 'destructive',
        title: 'No changes detected',
        description: 'Please make changes before submitting the form.',
      })
      return
    }

    if (values.approvalStatus === 'REJECTED' && !values.rejectionReason) {
      toast({
        variant: 'destructive',
        title: 'Rejection reason required',
        description: 'Please provide a reason for rejection.',
      })
      return
    }

    try {
      await onSubmit(values)
      queryClient.invalidateQueries({
        queryKey: ['companies'], // Updated query key for companies
      })
      onClose()
    } catch (error) {
      console.error('Error updating company status:', error)
      toast({
        variant: 'destructive',
        title: 'Status update failed',
        description: 'Something went wrong. Please try again.',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <span className="hidden"></span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change {companyName} Status</DialogTitle>
          <DialogDescription>
            Update the status for the company.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col w-full gap-5 p-2 mx-auto bg-white rounded-3xl"
          >
            <div className="flex flex-col w-full gap-5 p-2 mx-auto rounded-3xl">
              {/* Approval Status */}
              <FormField
                control={form.control}
                name="approvalStatus"
                render={({ field }) => (
                  <FormItem className="flex w-full mb-2 max-sm:flex-col">
                    <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                      Approval Status{' '}
                      <span className="mr-5 max-sm:hidden">:</span>
                    </FormLabel>
                    <div className="flex-col items-start w-full">
                      <FormControl>
                        <CompanyStatusDropdown
                          status={field.value}
                          setStatus={(value) => {
                            setStatus(value as typeof field.value)
                            field.onChange(value)
                          }}
                        />
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
                      <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
                        Rejection Reason{' '}
                        <span className="mr-5 max-sm:hidden">:</span>
                      </FormLabel>
                      <div className="flex-col items-start w-full">
                        <FormControl>
                          <Textarea
                            placeholder="Rejection reason"
                            {...field}
                            className="h-28 textarea rounded-2xl"
                            onChange={(e) => {
                              field.onChange(e)
                              setCharCount(e.target.value.length)
                            }}
                          />
                        </FormControl>
                        <div className="mt-1 ml-auto text-sm text-gray-500 w-fit">
                          {charCount} / 120
                        </div>
                        <FormMessage />
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
              Update Company Status
              {form.formState.isSubmitting && <Spinner />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
