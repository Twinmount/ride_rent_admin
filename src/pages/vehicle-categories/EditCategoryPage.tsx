import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import CategoryForm from '@/components/form/VehicleCategoryForm'
import { useQuery } from '@tanstack/react-query'
import { fetchCategoryById } from '@/api/vehicle-categories'

export default function EditCategoryPage() {
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () => fetchCategoryById(categoryId as string),
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
        <h3 className="text-center h3-bold sm:text-left">
          Update <span className="capitalize text-yellow ">category</span>
        </h3>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <CategoryForm type="Update" formData={data?.result} />
      )}
    </section>
  )
}
