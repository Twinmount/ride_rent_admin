import { ColumnDef } from '@tanstack/react-table'
import { SingleVehicleType } from '@/types/api-types/vehicleAPI-types'
import { Switch } from '@/components/ui/switch'

export const AllListingColumns: (
  onToggle: (vehicleId: string, isDisabled: boolean) => void,
  isPending?: boolean
) => ColumnDef<SingleVehicleType>[] = (onToggle, isPending) => [
  {
    accessorKey: 'vehicleModel',
    header: 'Model',
  },

  {
    accessorKey: 'vehicleCode',
    header: 'Vehicle Code',
  },
  {
    accessorKey: 'company.companyName',
    header: 'Company Name',
  },
  {
    accessorKey: 'isDisabled',
    header: 'Vehicle Status',
    cell: ({ row }) => {
      const vehicle = row.original

      return (
        <Switch
          checked={!vehicle.isDisabled}
          onCheckedChange={(checked) => onToggle(vehicle.vehicleId, !checked)}
          disabled={isPending}
          className={`${isPending && '!cursor-wait'}`}
        />
      )
    },
  },
]
