import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CompanyType } from '@/types/api-types/vehicleAPI-types'
import { Button } from '@/components/ui/button'

interface CompanyTableProps<TData extends CompanyType, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading: boolean
  onOpenModal: (company: CompanyType) => void // Prop to handle modal opening
}

export function CompanyTable<TData extends CompanyType, TValue>({
  columns,
  data,
  loading,
  onOpenModal, // Use the prop passed from the parent component
}: CompanyTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-black">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading ...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className=" !max-w-44">
                      {cell.column.id === 'companyName' ? (
                        <Link
                          to={`/registrations/view/${row.original.companyId}`}
                          className="font-semibold text-blue-600 hover:underline "
                        >
                          {cell.getValue() as string}
                        </Link>
                      ) : cell.column.id === 'approvalStatus' ? (
                        <Button
                          onClick={() => onOpenModal(row.original)} // Use the onOpenModal prop
                          className={`${
                            row.original.approvalStatus === 'APPROVED'
                              ? '!bg-green-500 text-white'
                              : row.original.approvalStatus === 'PENDING'
                              ? '!bg-blue-500 text-white'
                              : '!bg-red-500 text-white'
                          }`}
                        >
                          {row.original.approvalStatus}
                        </Button>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
