import HomeMetaForm from '@/components/form/HomeMetaForm'

import { CircleArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AddHomeMetaPage() {
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
          Add New State Meta Data
        </h3>
      </div>
      <HomeMetaForm type="Add" />
    </section>
  )
}
