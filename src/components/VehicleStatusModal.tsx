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
import StatusDropdown from '@/components/StatusDropdown'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from './ui/textarea'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'

// Define the form schema using Zod
const formSchema = z.object({
  approvalStatus: z.enum(['APPROVED', 'REJECTED', 'PENDING', 'UNDER_REVIEW']),
  rejectionReason: z.string().optional(),
})

// Define the prop types
type VehicleStatusModalProps = {
  vehicleModel: string
  isOpen: boolean
  rejectionReason: string
  currentStatus: 'APPROVED' | 'REJECTED' | 'PENDING' | 'UNDER_REVIEW'
  onClose: () => void
  onSubmit: (values: {
    approvalStatus: string
    rejectionReason?: string
  }) => Promise<void>
}

export default function VehicleStatusModal({
  vehicleModel,
  isOpen,
  currentStatus,
  rejectionReason,
  onClose,
  onSubmit,
}: VehicleStatusModalProps) {
  const [status, setStatus] = useState<
    'APPROVED' | 'REJECTED' | 'PENDING' | 'UNDER_REVIEW'
  >('PENDING')

  const queryClient = useQueryClient()

  const location = useLocation()

  // Check if the current URL path is "/listings/rejected"
  const isRejectedListings = location.pathname === '/listings/rejected'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approvalStatus: currentStatus,
      rejectionReason,
    },
  })

  const handleFormSubmit = async (values: {
    approvalStatus: string
    rejectionReason?: string
  }) => {
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
        queryKey: ['listings'],
        exact: true,
      })
      onClose()
    } catch (error) {
      console.error('Error updating vehicle status:', error)
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
          <DialogTitle>Change {vehicleModel} Status</DialogTitle>
          <DialogDescription>
            Update the status for the vehicle.
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
                        <StatusDropdown
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
              {(status === 'REJECTED' || isRejectedListings) && (
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
                          />
                        </FormControl>
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
              Update Vehicle Status
              {form.formState.isSubmitting && <Spinner />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
