import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SortDropdown } from '@/components/SortDropdown'
import { LimitDropdown } from '@/components/LimitDropdown'
import Pagination from '@/components/Pagination'
import { fetchNewOrModifiedVehicles, updateVehicleStatus } from '@/api/listings'
import { GeneralListingTable } from '@/components/table/live-listing/GeneralListingTable'
import { VehicleStatusType } from '@/types/formTypes'
import { GeneralListingColumns } from '@/components/table/live-listing/columns/GeneralListingsColumn'
import { SingleVehicleType } from '@/types/api-types/vehicleAPI-types'
import VehicleStatusModal from '@/components/VehicleStatusModal'
import { toast } from '@/components/ui/use-toast'
import { ListingsNavDropdown } from '@/components/ListingsNavDropdown'
import SearchComponent from '@/components/Search'
import { useSearchParams } from 'react-router-dom'

interface GeneralListingPageProps {
  queryKey: any[]
  approvalStatus: VehicleStatusType
  isModified?: boolean
  title: string
  newRegistration?: boolean
}

export default function GeneralListingPage({
  queryKey,
  approvalStatus,
  isModified = false,
  newRegistration,
}: GeneralListingPageProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [selectedVehicle, setSelectedVehicle] =
    useState<SingleVehicleType | null>(null)

  const queryClient = useQueryClient()

  const [searchParams] = useSearchParams()
  const searchTerm = searchParams.get('search') || ''

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder, searchTerm],
    queryFn: () =>
      fetchNewOrModifiedVehicles({
        page,
        limit,
        sortOrder,
        isModified,
        approvalStatus,
        newRegistration,
        search: searchTerm.trim(),
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
          queryClient.invalidateQueries({ queryKey: ['vehicles', 'listings'] })
          queryClient.invalidateQueries({
            queryKey: [...queryKey, page, limit, sortOrder, searchTerm],
            exact: true,
          })
          queryClient.invalidateQueries({
            queryKey: ['vehicle-listing-count'],
            exact: true,
          })
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
    <section className="container min-h-screen py-5 mx-auto md:py-7">
      <div className="my-2 mb-6 flex-between max-sm:flex-col">
        {/* navigation dropdown */}
        <ListingsNavDropdown />{' '}
        <div className="flex-between w-fit gap-x-2 max-sm:mt-3">
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

      {/* search component */}
      <div className="mb-8">
        <SearchComponent placeholder="Search vehicle" isBrandSearch={false} />
        <p className="ml-2 text-sm italic text-left text-gray-500">
          <span className="font-semibold text-gray-600">
            vehicle model,vehicle registration number, vehicle code, registered
            year or phone number
          </span>{' '}
          can be used to search the vehicle
        </p>
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
