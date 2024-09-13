import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { companyColumns } from '../../components/table/company-registrations/GeneralCompanyColumn'
import { CompanyTable } from '@/components/table/company-registrations/CompanyTable'
import { getAllCompany, updateCompanyStatus } from '@/api/company'
import { SortDropdown } from '@/components/SortDropdown'
import { LimitDropdown } from '@/components/LimitDropdown'
import Pagination from '@/components/Pagination'
import CompanyStatusModal from '@/components/CompanyStatusModal' // Modal for updating company status
import { toast } from '@/components/ui/use-toast'
import { CompanyType } from '@/types/api-types/vehicleAPI-types'
import { CompanyNavDropdown } from '@/components/CompanyNavDropdown'
import SearchComponent from '@/components/Search'

interface GeneralCompaniesPageProps {
  queryKey: string[]
  approvalStatus?: 'APPROVED' | 'PENDING' | 'REJECTED' | 'UNDER_REVIEW'
  isModified?: boolean
  title: string
}

export default function GeneralCompaniesPage({
  queryKey,
  approvalStatus,
  isModified = false,
}: GeneralCompaniesPageProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10)
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC')
  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    null
  )

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: [...queryKey, page, limit, sortOrder],
    queryFn: () =>
      getAllCompany({
        page,
        limit,
        sortOrder,
        approvalStatus,
        edited: isModified,
      }),
  })

  const handleOpenModal = (company: CompanyType) => {
    setSelectedCompany(company)
  }

  const handleCloseModal = () => {
    setSelectedCompany(null)
  }

  const handleSubmitModal = async (values: {
    approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED'
    rejectionReason?: string
  }) => {
    if (values.approvalStatus === 'PENDING') {
      toast({
        variant: 'destructive',
        title: 'Invalid Status Change',
        description: 'Cannot change status back to PENDING.',
      })
      return
    }
    if (selectedCompany) {
      try {
        const data = await updateCompanyStatus(
          {
            approvalStatus: values.approvalStatus,
            rejectionReason: values.rejectionReason,
          },
          selectedCompany.companyId // Pass the companyId separately
        )

        if (data) {
          queryClient.invalidateQueries({
            queryKey: [...queryKey, page, limit, sortOrder],
          })
          toast({
            title: 'Company status updated successfully',
            className: 'bg-green-500 text-white',
          })
        }

        handleCloseModal()
      } catch (error) {
        console.error('Failed to update company status:', error)
        toast({
          variant: 'destructive',
          title: 'Failed to update status',
          description:
            'Something went wrong while updating the company status.',
        })
      }
    }
  }

  return (
    <section className="container min-h-screen py-5 mx-auto md:py-7">
      <div className="my-2 mb-6 flex-between max-sm:flex-col">
        <CompanyNavDropdown />

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

      {/* search component */}
      <div className="mb-6">
        <SearchComponent placeholder="Search company" isBrandSearch={false} />
        <p className="ml-2 text-sm italic text-left text-gray-500">
          <span className="font-semibold text-gray-600">
            company name or agent id
          </span>{' '}
          can be used to search the company
        </p>
      </div>

      <CompanyTable
        columns={companyColumns(handleOpenModal)}
        data={data?.result?.list || []}
        loading={isLoading}
        onOpenModal={handleOpenModal} // Pass the handleOpenModal function to the table
      />

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages as number}
        />
      )}

      {selectedCompany && (
        <CompanyStatusModal
          rejectionReason={selectedCompany.rejectionReason || ''}
          companyName={selectedCompany.companyName}
          currentStatus={selectedCompany.approvalStatus}
          isOpen={!!selectedCompany}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </section>
  )
}
