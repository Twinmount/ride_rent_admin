import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'

import { fetchLinkById } from '@/api/links'
import LinkForm from '@/components/form/LinkForm'

export default function EditLinkPage() {
  const navigate = useNavigate()

  const { linkId } = useParams<{ linkId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['links', linkId],
    queryFn: () => fetchLinkById(linkId as string),
  })

  // Destructure to get the 'list' array from 'data'
  const linkData = data?.result

  // useEffect(
  //   () => console.log('fetch link by id ', linkId, data),
  //   [isLoading]
  // )

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">Update Link</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <LinkForm type="Update" formData={linkData} />
      )}
    </section>
  )
}
