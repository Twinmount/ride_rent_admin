import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { CompanyType } from '@/types/api-types/vehicleAPI-types'

// Define the function type for handleOpenModal
type HandleOpenModalType = (company: CompanyType) => void

// Modify the companyColumns function to accept handleOpenModal as a parameter
export const companyColumns = (
  handleOpenModal: HandleOpenModalType
): ColumnDef<CompanyType>[] => [
  {
    accessorKey: 'companyName',
    header: 'Company Name',
  },
  {
    accessorKey: 'agentId',
    header: 'Agent ID',
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const company = row.original

      return (
        <Button
          onClick={() => handleOpenModal(company)}
          className={`${
            company.approvalStatus === 'APPROVED'
              ? '!bg-green-500 text-white'
              : company.approvalStatus === 'PENDING'
              ? '!bg-blue-500 text-white'
              : '!bg-red-500 text-white'
          }`}
        >
          {company.approvalStatus}
        </Button>
      )
    },
  },
]
