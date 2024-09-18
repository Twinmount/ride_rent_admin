import { useQuery } from '@tanstack/react-query'
import { fetchListingMetaList } from '@/api/meta-data'

import LazyLoader from '@/components/skelton/LazyLoader'
import { MetaDataNavDropdown } from '@/components/MetaDataNavDropdown'
import SeoData from '@/components/general/SeoData'
import { fetchAllCategories } from '@/api/vehicle-categories'
import { CategoryType } from '@/types/api-types/vehicleAPI-types'
import { useEffect, useState } from 'react'
import MetaCategoryDropdown from '@/components/MetaCategoryDropdown'
import { useAdminContext } from '@/context/AdminContext'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Pagination from '@/components/Pagination'
import LocationNav from '@/components/LocationNav'

export default function ListingMetaDataPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  )
  const [page, setPage] = useState(1)

  const { state } = useAdminContext()

  // Fetch categories for dropdown
  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['categories', state, page],
    queryFn: () => fetchAllCategories({ page, limit: 20, sortOrder: 'ASC' }),
  })

  // Set initial category to "cars"
  useEffect(() => {
    if (categoryData?.result?.list) {
      const defaultCategory = categoryData.result.list.find(
        (category) => category.value === 'cars'
      )
      if (defaultCategory) {
        setSelectedCategory(defaultCategory)
      }
    }
  }, [categoryData, isCategoryLoading])

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['listing-meta-data', selectedCategory?.value],
    queryFn: () =>
      fetchListingMetaList({
        page: 1,
        limit: 20,
        sortOrder: 'ASC',
        category: selectedCategory?.value || '',
        state: state.stateValue,
      }),
    enabled: !!selectedCategory, // Fetch only when category is selected
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

      {/* category dropdown */}
      <MetaCategoryDropdown
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categoryData?.result?.list || []}
        isLoading={isCategoryLoading}
      />

      <div className="container max-w-4xl mx-auto space-y-3">
        {isLoading || isCategoryLoading ? (
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
              link="/meta-data/listing/edit"
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
          to={`/meta-data/listing/add`}
        >
          New Listing Meta <Plus />
        </Link>
      </button>
    </section>
  )
}
