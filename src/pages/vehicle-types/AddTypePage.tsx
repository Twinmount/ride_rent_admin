import { fetchCategoryById } from '@/api/vehicle-categories'
import VehicleTypeForm from '@/components/form/VehicleTypesForm'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddTypePage() {
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>()

  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['category', vehicleCategoryId],
    queryFn: () => fetchCategoryById(vehicleCategoryId as string),
    enabled: !!vehicleCategoryId,
  })

  const categoryName = data?.result?.name || 'Category'

  return (
    <section className="container pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="text-center h3-bold sm:text-left">
          Add New <span className="capitalize text-yellow">{categoryName}</span>{' '}
          Type
        </h3>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <VehicleTypeForm type="Add" category={categoryName} />
      )}
    </section>
  )
}
