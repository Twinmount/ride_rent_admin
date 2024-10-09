import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import BlogPromotionForm from '@/components/form/BlogPromotionForm'
import { fetchBlogPromotionById } from '@/api/blogs'

export default function EditPromotionPage() {
  const navigate = useNavigate()

  const { promotionId } = useParams<{ promotionId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['blog-promotion', promotionId],
    queryFn: () => fetchBlogPromotionById(promotionId as string),
  })

  // Destructure to get the 'list' array from 'data'
  const promotionData = data?.result

  return (
    <section className="container min-h-screen pt-5 pb-32">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">
          Update Blog Promotion
        </h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <BlogPromotionForm type="Update" formData={promotionData} />
      )}
    </section>
  )
}
