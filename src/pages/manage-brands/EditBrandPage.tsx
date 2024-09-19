import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import BrandForm from '@/components/form/BrandForm'
import { useQuery } from '@tanstack/react-query'
import { fetchBrandById } from '@/api/brands'

export default function EditBrandPage() {
  const { brandId } = useParams<{
    brandId: string
  }>()

  const navigate = useNavigate()

  const { data: brandData, isLoading } = useQuery({
    queryKey: ['brands', brandId],
    queryFn: () => fetchBrandById(brandId as string),
  })

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Update Brand</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <BrandForm type="Update" formData={brandData?.result} />
      )}
    </section>
  )
}
