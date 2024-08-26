import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AllListingColumns } from '../../components/table/live-listing/columns/AllListingColumn'
import { fetchAllVehicles, enableOrDisableVehicle } from '@/api/listings'
import { AllListingTable } from '@/components/table/live-listing/AllListingTable'
import { toast } from '@/components/ui/use-toast'
import ListingsNav from '@/components/ListingsNav'
import Pagination from '@/components/Pagination'
import { LimitDropdown } from '@/components/LimitDropdown'
import { SortDropdown } from '@/components/SortDropdown'
import { ListingsNavDropdown } from '@/components/ListingsNavDropdown'

export default function AllListingPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles listings', page, limit, sortOrder],
    queryFn: () =>
      fetchAllVehicles({ page, limit, sortOrder, approvalStatus: 'APPROVED' }),
  })

  const { mutateAsync: toggleVehicleStatus, isPending } = useMutation({
    mutationFn: async ({
      vehicleId,
      isDisabled,
    }: {
      vehicleId: string
      isDisabled: boolean
    }) => {
      await enableOrDisableVehicle({ vehicleId, isDisabled })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehicles listings', page, limit, sortOrder],
      })
      toast({
        title: 'Vehicle status updated',
        description: 'The status of the vehicle was  updated successfully.',
        className: 'bg-yellow text-white',
      })
    },
    onError: (error) => {
      console.error('Error updating vehicle status:', error)
      toast({
        variant: 'destructive',
        title: 'Failed to update vehicle status',
        description: 'An error occurred while updating the vehicle status.',
      })
    },
  })

  const handleToggle = async (vehicleId: string, isDisabled: boolean) => {
    await toggleVehicleStatus({ vehicleId, isDisabled })
  }

  return (
    <section className="container min-h-screen py-5 mx-auto md:py-7">
      <div className="my-2 mb-6 flex-between max-md:flex-col">
        {/* navigation dropdown */}
        <ListingsNavDropdown />{' '}
        <div className="flex-between w-fit gap-x-2">
          <SortDropdown
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isLoading={isLoading}
          />
          <LimitDropdown
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
        </div>
      </div>

      <AllListingTable
        columns={AllListingColumns(handleToggle, isPending)}
        data={data?.result?.list || []}
        loading={isLoading}
      />

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages as number}
        />
      )}
    </section>
  )
}
