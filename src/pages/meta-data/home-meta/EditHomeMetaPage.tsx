import { fetchHomeMetaDataById } from '@/api/meta-data'
import HomeMetaForm from '@/components/form/HomeMetaForm'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'

import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditHomeMetaPage() {
  const navigate = useNavigate()

  const { metaDataId } = useParams<{ metaDataId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['promotions', metaDataId],
    queryFn: () => fetchHomeMetaDataById(metaDataId as string),
  })

  const metaData = data?.result

  return (
    <section className="container pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h3 className="text-center h3-bold sm:text-left">Edit Home Meta</h3>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <HomeMetaForm type="Update" formData={metaData} />
      )}
    </section>
  )
}
