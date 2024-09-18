import { useQuery } from '@tanstack/react-query'
import { fetchHomeMetaList } from '@/api/meta-data'

import LazyLoader from '@/components/skelton/LazyLoader'
import { MetaDataNavDropdown } from '@/components/MetaDataNavDropdown'
import SeoData from '@/components/general/SeoData'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import Pagination from '@/components/Pagination'
import { useState } from 'react'
import LocationNav from '@/components/LocationNav'

export default function HomeMetaData() {
  const [page, setPage] = useState(1)

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['home-meta-data', page],
    queryFn: () =>
      fetchHomeMetaList({
        page,
        limit: 20,
        sortOrder: 'ASC',
      }),
  })

  // Function to truncate the text
  const truncateText = (text: string, limit: number) => {
    if (text.length > limit) {
      return text.slice(0, limit) + '...'
    }
    return text
  }

  const seoData = data?.result?.list || []

  return (
    <section className="w-full h-auto min-h-screen py-10 bg-gray-100">
      <LocationNav
        navItems={[
          { label: 'Home Page', to: '/meta-data/home' },
          { label: 'Listings Page', to: '/meta-data/listing' },
        ]}
      />
      <div className="container max-w-4xl mx-auto space-y-3">
        {isLoading ? (
          <LazyLoader />
        ) : seoData.length === 0 ? (
          <div className="flex justify-center h-screen text-2xl font-semibold pt-36">
            No Data Found !
          </div>
        ) : (
          seoData.map((item) => (
            <SeoData
              key={item.metaDataId}
              item={item}
              truncateText={truncateText}
              link="/meta-data/home/edit"
            />
          ))
        )}
      </div>

      {seoData.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages || 1}
        />
      )}

      <button className="fixed z-30  overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all">
        <Link
          className="flex-center gap-x-1 px-3 py-2 text-white  shadow-xl hover:scale-[1.02]  transition-all bg-yellow flex-center"
          to={`/meta-data/home/add`}
        >
          New Home Meta <Plus />
        </Link>
      </button>
    </section>
  )
}
