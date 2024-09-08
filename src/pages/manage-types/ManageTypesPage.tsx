import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import CategoryDropdown from '@/components/VehicleCategoryDropdown'
import { fetchAllCategories } from '@/api/vehicle-categories'
import { fetchAllVehicleTypes } from '@/api/vehicle-types'
import { CategoryType } from '@/types/api-types/API-types'
import GridSkelton from '@/components/skelton/GridSkelton'
import { Plus } from 'lucide-react'

export default function ManageTypesPage() {
  const navigate = useNavigate()
  const { vehicleCategoryId } = useParams<{ vehicleCategoryId: string }>()
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | undefined
  >()

  //vehicle categories fetching for dropdown
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategories({ page: 1, limit: 20, sortOrder: 'ASC' }),
  })

  // redirecting to "/manage-types/categoryId" route as soon as the category data is fetched
  useEffect(() => {
    if (isSuccess) {
      const categories = categoryData?.result?.list || []
      if (!vehicleCategoryId && categories.length > 0) {
        const firstCategory = categories[0]
        navigate(`/manage-types/${firstCategory.categoryId}`, { replace: true })
      }
    }
  }, [isSuccess, categoryData, vehicleCategoryId, navigate])

  // destructuring the "categories" from categoryData
  const { list: categories = [] } = categoryData?.result || {}

  // vehicle types fetching after category is fetched
  const { data: vehicleTypeData, isLoading: isVehicleTypeLoading } = useQuery({
    queryKey: ['vehicle-types', vehicleCategoryId],
    queryFn: () =>
      fetchAllVehicleTypes({
        page: 1,
        limit: 20,
        sortOrder: 'ASC',
        vehicleCategoryId: vehicleCategoryId || '',
      }),
    enabled: !!vehicleCategoryId,
  })

  // destructuring list from vehicleTypeData
  const { list } = vehicleTypeData?.result || {}

  // setting selected category
  useEffect(() => {
    if (vehicleCategoryId) {
      const selected = categories.find(
        (category) => category.categoryId === vehicleCategoryId
      )
      setSelectedCategory(selected)
      console.log(vehicleTypeData)
    }
  }, [vehicleCategoryId, categories])

  const noTypeCategories = ['buses', 'buggies', 'vans', 'yachts']

  return (
    <section className="container h-auto min-h-screen pb-10">
      <div className="h-20 px-10 mb-6 flex-between">
        <h1 className="text-2xl font-bold ">
          Manage{' '}
          <span className="text-yellow">
            {selectedCategory ? selectedCategory.name : 'Vehicle'}
          </span>{' '}
          Types
        </h1>

        {/* vehicle category dropdown */}
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isLoading={isCategoryLoading}
          type="type"
        />
      </div>

      {isVehicleTypeLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4">
          <GridSkelton type="category" />
        </div>
      ) : noTypeCategories.includes(selectedCategory?.value as string) ? (
        <div className="text-2xl text-center mt-36">
          No vehicle types for{' '}
          <span className="italic font-semibold">{selectedCategory?.name}</span>
        </div>
      ) : list && list.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 place-items-center gap-y-4">
          {list.map((data) => (
            <Link
              key={data.typeId}
              to={`/manage-types/${vehicleCategoryId}/edit/${data.typeId}`}
              className="flex flex-col w-full overflow-hidden text-xl font-semibold capitalize transition-all bg-white border rounded-lg shadow-md h-36 flex-center hover:text-yellow hover:border-yellow"
            >
              <div className="w-[90%] mx-auto h-[80%]">
                <img
                  src={`/assets/icons/vehicle-types/${selectedCategory?.value}/${data.value}.webp`}
                  alt={`${data.name} logo`}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="w-[95%] text-sm text-center truncate">
                {' '}
                {data.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-36">
          No Vehicle Types Found!
        </div>
      )}

      {/* add new category */}
      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all">
        <Link
          className="flex-center gap-x-1 px-3 py-2 text-white  shadow-xl hover:scale-[1.02]  transition-all bg-yellow flex-center"
          to={`/manage-types/${selectedCategory?.categoryId}/add`}
        >
          New Type <Plus />
        </Link>
      </button>
    </section>
  )
}
