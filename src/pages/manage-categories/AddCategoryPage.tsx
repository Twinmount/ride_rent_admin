import CategoryForm from '@/components/form/VehicleCategoryForm'
import { CircleArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AddCategoryPage() {
  const navigate = useNavigate()

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
          Add New <span className="capitalize text-yellow ">category</span>
        </h3>
      </div>
      <CategoryForm type="Add" />
    </section>
  )
}
