import { useQuery } from '@tanstack/react-query'
import { fetchHomeMetaList } from '@/api/meta-data'

import LazyLoader from '@/components/skelton/LazyLoader'
import { MetaDataNavDropdown } from '@/components/MetaDataNavDropdown'
import SeoData from '@/components/general/SeoData'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomeMetaData() {
  // Sample data to display if backend returns an empty array
  const sampleData = [
    {
      metaDataId: '1',
      stateId: '1',
      state: 'Umm Al Quwain',
      metaTitle:
        'Affordable Fat Bicycle Rentals in Umm Al Quwain: Trek, Mongoose, Specialized, Salsa, Cannondale, Surly | Best Models at Ride.Rent | Daily, Weekly, Monthly Options',
      metaDescription:
        "Discover the top cruiser bicycle rentals in Fujairah with Ride.Rent. Choose from a variety of trusted brands like Electra, Schwinn, Firmstrong, Huffy, Sixthreezero, and Raleigh. Popular models such as Electra Townie, Schwinn Sanctuary, Firmstrong Urban Lady, Huffy Panama Jack, Sixthreezero Around the Block, and Raleigh Retroglide are available for rent. We offer flexible rental options for daily, weekly, or monthly use, all at competitive prices. Explore Fujairah’s scenic and popular areas, including Fujairah Corniche, Al Aqah Beach, Fujairah Fort, Dibba Al-Fujairah, Al Bidyah Mosque, Kalba, Wadi Wurayah, and Fujairah City Centre. Ride.Rent provides a seamless and easy rental experience with straightforward online booking, fast delivery, and reliable customer support. With no middlemen, you can enjoy instant bookings and a smooth rental process. Whether you're cruising along the coastline, visiting historical landmarks, or enjoying the natural beauty of Fujairah's outdoor spots, our cruiser bicycles offer a comfortable and enjoyable way to see the city. Visit Ride.Rent today to book your cruiser bicycle and experience the best cycling experience Fujairah has to offer. With Ride.Rent, you get quality bikes, great customer service, and an unforgettable biking experience.",
    },
  ]

  // Fetch meta data using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ['home-meta-data'],
    queryFn: () =>
      fetchHomeMetaList({
        page: 1,
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

  if (isLoading) {
    return <LazyLoader />
  }

  const seoData = data?.result?.list || []

  return (
    <section className="w-full h-auto min-h-screen py-10 bg-gray-100">
      <MetaDataNavDropdown />
      <div className="container max-w-4xl mx-auto space-y-8">
        {seoData.length === 0 ? (
          <div className="flex justify-center h-screen text-2xl font-semibold pt-36">
            No Data Found !
          </div>
        ) : (
          seoData.map((item) => (
            <SeoData
              key={item.metaDataId}
              item={item}
              truncateText={truncateText}
              link="/manage-meta-data/edit"
            />
          ))
        )}
      </div>

      <button className="fixed z-30  overflow-hidden cursor-pointer w-fit h-fit rounded-xl right-10 bottom-10 shadow-xl  hover:scale-[1.02]  transition-all">
        <Link
          className="flex-center gap-x-1 px-3 py-2 text-white  shadow-xl hover:scale-[1.02]  transition-all bg-yellow flex-center"
          to={`/manage-meta-data/add`}
        >
          New Home Meta <Plus />
        </Link>
      </button>
    </section>
  )
}
