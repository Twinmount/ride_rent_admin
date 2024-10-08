import Navbar from '@/components/general/Navbar'
import Sidebar from '@/components/general/Sidebar'
import MainWrapper from '@/components/general/MainWrapper'
import { useAdminContext } from '@/context/AdminContext'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import StatesLoadingSkelton from '@/components/skelton/StatesLoader'
import ScrollToTop from '@/helpers/ScrollToTop'
import { getAllVehicleListingCount } from '@/api/vehicle'
import { MantineProvider } from '@mantine/core'

export default function Layout() {
  const { state, setState } = useAdminContext()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['states-with-listing-count'],
    queryFn: getAllVehicleListingCount,
    staleTime: 5 * 60 * 1000,
  })

  const options = data?.result || []

  // Find Dubai state and set as default if state is not set
  useEffect(() => {
    if (!isLoading && options?.length && !state.stateId) {
      const dubaiState = options.find(
        (state) => state.stateValue.toLowerCase() === 'dubai'
      )
      if (dubaiState) {
        const { stateId, stateName, stateValue } = dubaiState
        setState({ stateId, stateName, stateValue })
      } else {
        setState(options[0])
      }
    }
  }, [options, state.stateId, setState, isLoading])

  if (isError) {
    return (
      <div className="flex justify-center w-full h-screen pt-64 text-3xl text-red-500 bg-white ">
        Error fetching states :\ <br />
        {error?.message}
      </div>
    )
  }

  return (
    <MantineProvider>
      <Navbar options={options} isLoading={isLoading} />
      <Sidebar />
      <ScrollToTop />
      <MainWrapper>
        {isLoading ? (
          <div>
            <StatesLoadingSkelton />
          </div>
        ) : (
          <Outlet />
        )}
      </MainWrapper>
    </MantineProvider>
  )
}
