import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchCityById } from '@/api/cities'
import CityForm from '@/components/form/CityForm'

export default function EditCityPage() {
  const navigate = useNavigate()

  const { cityId } = useParams<{ cityId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['cities', cityId],
    queryFn: () => fetchCityById(cityId as string),
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
        <h1 className="text-center h3-bold sm:text-left">Update City</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <CityForm type="Update" formData={data?.result} />
      )}
    </section>
  )
}
