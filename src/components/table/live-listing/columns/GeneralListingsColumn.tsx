import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { SingleVehicleType } from '@/types/api-types/vehicleAPI-types'

export const GeneralListingColumns = (
  handleOpenModal: (vehicle: SingleVehicleType) => void
): ColumnDef<SingleVehicleType>[] => [
  {
    accessorKey: 'vehicleModel',
    header: 'Model',
  },

  {
    accessorKey: 'vehicleId',
    header: 'Vehicle ID',
  },
  {
    accessorKey: 'company.companyName',
    header: 'Company Name',
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Approval Status',
    cell: ({ row }) => {
      const vehicle = row.original

      return (
        <Button
          onClick={() => handleOpenModal(vehicle)}
          className={`${
            vehicle.approvalStatus === 'APPROVED'
              ? '!bg-green-500 text-white'
              : vehicle.approvalStatus === 'PENDING'
              ? '!bg-blue-500 text-white'
              : vehicle.approvalStatus === 'UNDER_REVIEW'
              ? '!bg-yellow-500 text-white'
              : '!bg-red-500 text-white'
          }`}
        >
          {vehicle.approvalStatus}
        </Button>
      )
    },
  },
]
