import { useAdminContext } from '@/context/AdminContext'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import StateSkelton from '@/components/skelton/StateSkelton'
import { useQuery } from '@tanstack/react-query'
import { fetchAllStates } from '@/api/states'
import LocationNav from '@/components/LocationNav'

export default function ManageStatesPage() {
  const { org } = useAdminContext()

  const { data, isLoading } = useQuery({
    queryKey: ['states'],
    queryFn: fetchAllStates,
  })

  // useEffect(() => {
  //   console.log(data)
  // }, [isLoading])

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
        States Under <span className="text-yellow">{org.label}</span> Org
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <StateSkelton />
        </div>
      ) : data?.result && data.result.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.result.map((data) => (
            <Link
              to={`/locations/manage-States/edit/${data.stateId}`}
              key={data.stateId}
              className="relative w-full overflow-hidden bg-white shadow-md rounded-xl h-44 group"
            >
              <div className="absolute top-0 bottom-0 left-0 right-0  bg-gradient-to-t from-black to-50% z-10" />
              <div className="z-10 w-full h-full ">
                {/* Image */}
                <img
                  src={data.stateImage}
                  alt="ad image"
                  loading="lazy"
                  className="z-20 object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                />
              </div>

              <p className="absolute bottom-0 z-10 p-0 mt-1 font-bold text-center text-white transform -translate-x-1/2 whitespace-nowrap left-1/2 ">
                {data.stateName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-2xl text-center mt-36">No Locations Found!</div>
      )}

      <button className="fixed z-30 overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all ">
        <Link
          className="px-3 py-2 text-white flex-center gap-x-1 bg-yellow"
          to={`/locations/manage-states/add`}
        >
          New Location <Plus />
        </Link>
      </button>
    </section>
  )
}
