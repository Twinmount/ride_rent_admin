import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import FormSkelton from '@/components/skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchPromotionById } from '@/api/promotions'
import PromotionForm from '@/components/form/PromotionForm'

export default function EditPromotionPage() {
  const navigate = useNavigate()

  const { promotionId } = useParams<{ promotionId: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['promotions', promotionId],
    queryFn: () => fetchPromotionById(promotionId as string),
  })

  // Destructure to get the 'list' array from 'data'
  const promotionData = data?.result

  return (
    <section className="container min-h-screen pb-32 pt-5">
      <div className="flex-center mb-5 ml-5 w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-center w-fit border-none outline-none transition-colors hover:text-yellow"
          aria-label="Go back"
          title="Go back"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="h3-bold text-center sm:text-left">Update Promotion</h1>
      </div>
      {isLoading ? (
        <FormSkelton />
      ) : (
        <PromotionForm type="Update" formData={promotionData} />
      )}
    </section>
  );
}
