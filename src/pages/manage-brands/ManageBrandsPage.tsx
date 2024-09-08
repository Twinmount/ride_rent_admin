import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import GridSkelton from '@/components/skelton/GridSkelton'
import Pagination from '@/components/Pagination'
import SearchComponent from '@/components/Search'

import CategoryDropdown from '@/components/VehicleCategoryDropdown'
import { CategoryType } from '@/types/api-types/API-types'
import { fetchAllCategories } from '@/api/vehicle-categories'
import { useQuery } from '@tanstack/react-query'
import { fetchAllBrands } from '@/api/brands'

export default function ManageBrandsPage() {
  const navigate = useNavigate()
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>()
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >()

  const [searchParams] = useSearchParams()

  //vehicle categories fetching for dropdown
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: 'ASC' }),
  })

  // redirecting to "/manage-brands/categoryId" route as soon as the category data is fetched
  useEffect(() => {
    if (isSuccess) {
      const categories = categoryData?.result?.list || []
      if (!vehicleCategoryId && categories.length > 0) {
        const firstCategory = categories[0]
        navigate(`/manage-brands/${firstCategory.categoryId}`, {
          replace: true,
        })
      }
    }
  }, [isSuccess, categoryData, vehicleCategoryId, navigate])

  // destructuring the "categories" from categoryData
  const { list: categories = [] } = categoryData?.result || {}

  // Brands fetching after category is fetched
  const {
    data: brandData,
    isLoading: isBrandsLoading,
    refetch: refetchBrands,
  } = useQuery({
    queryKey: ['brands', vehicleCategoryId, page],
    queryFn: () =>
      fetchAllBrands({
        page: page,
        limit: 20,
        sortOrder: 'ASC',
        vehicleCategoryId: vehicleCategoryId as string, // ensure this is non-null
        search: searchParams.get('search') || '',
      }),

    enabled: !!vehicleCategoryId && !isCategoryLoading,
  })

  // destructuring brandData
  const brandList = brandData?.result?.list || []

  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL

  // setting selected category
  useEffect(() => {
    if (vehicleCategoryId && categoryData) {
      const selected = categoryData.result.list.find(
        (category) => category.categoryId === vehicleCategoryId
      )
      setSelectedCategory(selected)
      setPage(1)
    }
  }, [vehicleCategoryId, categoryData])

  useEffect(() => {
    if (vehicleCategoryId) {
      refetchBrands()
    }
  }, [searchParams, page, vehicleCategoryId])

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="h-20 pl-2 pr-10 flex-between">
        <h1 className="text-2xl font-bold capitalize whitespace-nowrap">
          Manage{' '}
          <span className="text-yellow">
            {selectedCategory ? selectedCategory.name : 'Vehicle'}
          </span>{' '}
          Brands
        </h1>

        {/* vehicle category dropdown */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isLoading={isCategoryLoading}
          type="brand"
        />
      </div>

      {/* search component */}
      <SearchComponent />

      {/* Render brands grid only when vehicleCategoryId is available */}
      {vehicleCategoryId ? (
        <>
          {isBrandsLoading ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4">
              <GridSkelton type="brand" />
            </div>
          ) : brandList.length === 0 ? (
            <div className="flex-col text-center flex-center h-72 col-span-full">
              <p className="text-xl font-semibold text-gray-800">
                No brands found{' '}
                {searchParams.get('search') &&
                  `for "${searchParams.get('search')}"`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4">
              {brandList.map((data) => (
                <Link
                  to={`/manage-brands/edit/${data.id}`}
                  key={data.id}
                  className="w-full bg-white border min-w-32 h-36 rounded-xl"
                >
                  <div className="flex-center w-auto h-[7.5rem] p-2 ">
                    <img
                      src={`${baseAssetsUrl}/icons/brands/${data.brandName}.png`}
                      alt={data.brandName}
                      className="object-contain w-[95%] h-full max-w-28"
                    />
                  </div>
                  <div className="max-w-full text-sm font-semibold text-center">
                    {data.brandName}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {brandList.length > 0 && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPages={brandData?.result.total as number}
            />
          )}
        </>
      ) : (
        <GridSkelton type="brand" />
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all">
        <Link
          className="flex-center gap-x-1 px-3 py-2 text-white  shadow-xl hover:scale-[1.02]  transition-all bg-yellow flex-center"
          to={`/manage-brands/${selectedCategory?.categoryId}/add-brand`}
        >
          New Brand <Plus />
        </Link>
      </button>
    </section>
  )
}
