import PromotionForm from '@/components/form/PromotionForm'
import { useAdminContext } from '@/context/AdminContext'

import { CircleArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AddPromotionPage() {
  const navigate = useNavigate()
  const { state } = useAdminContext()

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
          Add New Promotion Under {state.stateName}
        </h3>
      </div>
      <PromotionForm type="Add" />
    </section>
  )
}
