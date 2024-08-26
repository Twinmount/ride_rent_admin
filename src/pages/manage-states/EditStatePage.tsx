import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import StateForm from '@/components/form/StateForm'
import { useQuery } from '@tanstack/react-query'

import { fetchStateById } from '@/api/states'

export default function EditLocationPage() {
  const navigate = useNavigate()

  const { stateId } = useParams<{ stateId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['states', stateId],
    queryFn: () => fetchStateById(stateId as string),
  })

  // useEffect(() => console.log(data), [isLoading])

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Update State</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <StateForm type="Update" formData={data?.result} />
      )}
    </section>
  )
}
