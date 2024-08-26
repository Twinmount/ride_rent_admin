import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import CompanyForm from '@/components/form/main-form/CompanyForm'
import { Link, useParams } from 'react-router-dom'
import { getCompany } from '@/api/company'

export default function CompanyDetailsPage() {
  const { companyId } = useParams<{ companyId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => getCompany(companyId as string),
  })

  return (
    <section className="py-5 pt-10">
      <h1 className="mb-4 text-3xl font-bold text-center">Company Details</h1>

      {isLoading ? (
        <FormSkelton />
      ) : (
        <CompanyForm type="Update" formData={data?.result} />
      )}

      {data?.result.approvalStatus === 'APPROVED' && (
        <div className="mt-5 mb-10 ml-12 text-lg font-semibold text-blue-500 hover:underline">
          <Link to={`/listings/add/${data?.result.userId}`}>
            Manually Add vehicles under this company?
          </Link>
        </div>
      )}
    </section>
  )
}
