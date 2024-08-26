import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SortDropdown } from '@/components/SortDropdown'
import { LimitDropdown } from '@/components/LimitDropdown'
import Pagination from '@/components/Pagination'
import { fetchNewOrModifiedVehicles, updateVehicleStatus } from '@/api/listings'
import { GeneralListingTable } from '@/components/table/live-listing/GeneralListingTable'
import ListingsNav from '@/components/ListingsNav'
import { VehicleStatusType } from '@/types/formTypes'
import { GeneralListingColumns } from '@/components/table/live-listing/columns/GeneralListingsColumn'
import { SingleVehicleType } from '@/types/api-types/vehicleAPI-types'
import VehicleStatusModal from '@/components/VehicleStatusModal'
import { toast } from '@/components/ui/use-toast'

interface GeneralListingPageProps {
  queryKey: any[]
  approvalStatus: VehicleStatusType
  isModified?: boolean
  title: string
}

export default function GeneralListingPage({
  queryKey,
  approvalStatus,
  isModified = false,
  title,
}: GeneralListingPageProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleType | null>(null)

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder],
    queryFn: () =>
      fetchNewOrModifiedVehicles({
        page,
        limit,
        sortOrder,
        isModified,
        approvalStatus,
      }),
  })

  const handleOpenModal = (vehicle: SingleVehicleType) => {
    setSelectedVehicle(vehicle)
  }

  const handleCloseModal = () => {
    setSelectedVehicle(null)
  }

  // Handler for submitting the form in the modal
  const handleSubmitModal = async (values: {
    approvalStatus: string
    rejectionReason?: string
  }) => {
    if (selectedVehicle) {
      try {
        const data = await updateVehicleStatus({
          vehicleId: selectedVehicle.vehicleId,
          approvalStatus: values.approvalStatus,
          rejectionReason: values.rejectionReason,
        })

        if (data) {
          queryClient.invalidateQueries({ queryKey: ['vehicles'], exact: true })
          toast({
            title: 'Vehicle status updated successfully',
            className: 'bg-green-500 text-white',
          })
        }

        handleCloseModal()
      } catch (error) {
        console.error('Failed to update vehicle status:', error)
        toast({
          variant: 'destructive',
          title: 'Failed to update status',
          description:
            'Something went wrong while updating the vehicle status.',
        })
      }
    }
  }

  return (
    <section className="container min-h-screen py-10 mx-auto">
      <ListingsNav />
      <div className="my-8 flex-between max-sm:flex-col">
        <h1 className="ml-2 text-2xl font-bold tracking-tight">{title}</h1>

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

      <GeneralListingTable
        columns={GeneralListingColumns(handleOpenModal)}
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

      {selectedVehicle && (
        <VehicleStatusModal
          rejectionReason={selectedVehicle.rejectionReason || ''}
          vehicleModel={selectedVehicle.vehicleModel}
          currentStatus={selectedVehicle.approvalStatus}
          isOpen={!!selectedVehicle}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </section>
  )
}
