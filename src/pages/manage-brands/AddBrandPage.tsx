import { fetchCategoryById } from '@/api/vehicle-categories'
import BrandForm from '@/components/form/BrandForm'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'

import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddBrandPage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>()

  const navigate = useNavigate()

  const { isLoading } = useQuery({
    queryKey: ['category', vehicleCategoryId],
    queryFn: () => fetchCategoryById(vehicleCategoryId as string),
    enabled: !!vehicleCategoryId,
  })

  return (
    <section className="container pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="text-center h3-bold sm:text-left">Add New Brand</h3>
      </div>
      {isLoading ? <FormSkelton /> : <BrandForm type="Add" />}
    </section>
  )
}
