import { useAdminContext } from '@/context/AdminContext'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAllCities } from '@/api/cities'
import LocationNav from '@/components/LocationNav'
import GridSkelton from '@/components/skelton/GridSkelton'

export default function ManageCitiesPage() {
  const { state } = useAdminContext()

  const { data, isLoading } = useQuery({
    queryKey: ['cities', state],
    queryFn: () => fetchAllCities(state.stateId as string),
  })

  const cities = data?.result || []

  return (
    <section className="container h-auto min-h-screen pb-10">
      {/* navigate between states and cities */}
      <LocationNav
        navItems={[
          { label: 'States', to: '/locations/manage-states' },
          { label: 'Cities', to: '/locations/manage-cities' },
        ]}
      />
      <h1 className="mt-6 mb-8 text-2xl font-bold text-center sm:text-left">
        Cities Under <span className="text-yellow">{state.stateName}</span>
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <GridSkelton type="brand" />
        </div>
      ) : cities.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {cities.map((data) => (
            <Link
              to={`/locations/manage-cities/edit/${data.cityId}`}
              key={data.cityId}
              className="w-full overflow-hidden text-base text-center bg-white border shadow-md rounded-xl h-14 flex-center hover:text-yellow hover:border-yellow"
            >
              {data.cityName}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-36">No Cities Found!</div>
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/locations/manage-cities/add`}
        >
          New City <Plus />
        </Link>
      </button>
    </section>
  )
}
