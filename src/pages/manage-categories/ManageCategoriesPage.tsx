import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import GridSkelton from '@/components/skelton/GridSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchAllCategories } from '@/api/vehicle-categories'
import NavigationTab from '@/components/NavigationTab'
import { useState } from 'react'
import Pagination from '@/components/Pagination'

export default function ManageCategoriesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAllCategories({ page, limit: 20, sortOrder: 'ASC' }),
  })

  // Destructure the result from data
  const { list: categories = [] } = data?.result || {}

  const baseAssetsUrl = import.meta.env.VITE_ASSETS_URL

  return (
    <section className="container h-auto min-h-screen pb-10">
      {/* navigate between states and cities */}
      <NavigationTab
        navItems={[
          { label: 'Categories', to: '/vehicle/manage-categories' },
          { label: 'Types', to: '/vehicle/manage-types' },
        ]}
      />

      <div className="h-20 px-10 mb-6 flex-between">
        <h1 className="text-2xl font-bold">
          Manage <span className="text-yellow">Vehicle Categories</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 place-items-center gap-y-4">
          <GridSkelton type="category" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 place-items-center gap-y-4">
          {categories.map((category) => (
            <Link
              to={`/vehicle/manage-categories/edit/${category.categoryId}`}
              key={category.categoryId}
              className="flex flex-col w-full overflow-hidden text-xl font-semibold capitalize transition-all bg-white border rounded-lg shadow-md h-36 flex-center hover:text-yellow hover:border-yellow"
            >
              <div className="w-[70%] flex-center mx-auto h-[80%]">
                <img
                  src={`${baseAssetsUrl}/icons/vehicle-categories/${category.value}.png`}
                  alt={`${category.name} logo`}
                  className="object-contain w-[70%] h-full"
                />
              </div>
              <span className="mb-1">{category.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-36">No Categories Found!</div>
      )}

      {/* add new category */}
      <button className="fixed z-30  overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all">
        <Link
          className="flex-center gap-x-1 px-3 py-2 text-white  shadow-xl hover:scale-[1.02]  transition-all bg-yellow flex-center"
          to={`/vehicle/manage-categories/add`}
        >
          New Category <Plus />
        </Link>
      </button>

      {categories.length > 0 && (
        <div className="mt-auto">
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={data?.result.totalNumberOfPages || 1}
          />
        </div>
      )}
    </section>
  )
}
