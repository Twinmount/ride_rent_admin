import { useState } from 'react'
import { useAdminContext } from '@/context/AdminContext'
import AdsSkelton from '@/components/skelton/AdsSkelton'
import PromotionPreviewModal from '@/components/modal/PromotionPreviewModal'
import { fetchAllPromotions } from '@/api/promotions'
import { useQuery } from '@tanstack/react-query'
import { Eye, FilePenLine, Plus } from 'lucide-react'

import { Link } from 'react-router-dom'
import { PromotionType } from '@/types/api-types/API-types'
import NavigationTab from '@/components/NavigationTab'
import Pagination from '@/components/Pagination'

export default function ManagePromotionsPage() {
  const { state } = useAdminContext()
  const [selectedPromotion, setSelectedPromotion] =
    useState<PromotionType | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['promotions', state],
    queryFn: () =>
      fetchAllPromotions({
        page,
        limit: 10,
        sortOrder: 'DESC',
        stateId: state.stateId as string,
      }),
  })

  // Destructure to get the 'list' array from 'data'
  const promotions = data?.result?.list || []

  return (
    <section className="container h-auto min-h-screen pb-10">
      {/* navigate between quick links and promotions */}
      <NavigationTab
        navItems={[
          { label: 'Quick Links', to: '/marketing/quick-links' },
          { label: 'Promotions', to: '/marketing/promotions' },
        ]}
      />

      <h1 className="mt-6 mb-8 text-2xl font-bold text-center sm:text-left">
        Currently Published Ads In{' '}
        <span className="text-yellow">{state.stateName}</span>
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AdsSkelton />
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {promotions.map((data) => (
            <div
              key={data.promotionId}
              className="relative w-full overflow-hidden rounded-lg h-72 group"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 flex-center gap-x-4 bg-black/80 group-hover:opacity-100">
                {/* preview Modal Trigger */}
                <div
                  className="z-20 text-white cursor-pointer group/preview flex-center gap-x-1 hover:text-yellow"
                  onClick={() => setSelectedPromotion(data)}
                >
                  <span className="opacity-0 group-hover/preview:opacity-100">
                    Preview
                  </span>{' '}
                  <Eye size={25} />
                </div>
                <Link
                  to={`/marketing/promotions/edit/${data.promotionId}`}
                  className="text-white flex-center gap-x-1 hover:text-yellow group/edit"
                >
                  <FilePenLine size={23} />{' '}
                  <span className="opacity-0 group-hover/edit:opacity-100">
                    Edit
                  </span>
                </Link>
              </div>

              {/* Image */}
              <img
                src={data.promotionImage}
                alt="promotion image"
                loading="lazy"
                className="z-0 object-cover w-full h-full rounded-lg"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-20 text-xl font-semibold text-center text-gray-500">
          No ads found under
          <span className="italic font-bold"> {state.stateName}</span>
        </p>
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/marketing/promotions/add`}
        >
          New Promotion <Plus />
        </Link>
      </button>

      {promotions.length > 0 && (
        <div className="mt-auto">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data?.result.totalNumberOfPages || 1}
          />
        </div>
      )}

      {/* Render the modal once, passing the selected ad image */}
      {selectedPromotion && (
        <PromotionPreviewModal
          selectedPromotion={selectedPromotion}
          setSelectedPromotion={setSelectedPromotion}
        />
      )}
    </section>
  )
}
