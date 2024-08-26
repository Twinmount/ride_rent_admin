import Navbar from '@/components/general/Navbar'
import Sidebar from '@/components/general/Sidebar'
import MainWrapper from '@/components/general/MainWrapper'
import { useAdminContext } from '@/context/AdminContext'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchAllStates } from '@/api/states'
import { useEffect } from 'react'
import { stateType } from '@/types/types'
import StatesLoadingSkelton from '@/components/skelton/StatesLoader'

export default function Layout() {
  const { state, setState } = useAdminContext()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['states'],
    queryFn: fetchAllStates,
  })

  // Extract the result array from the FetchStatesResponse
  const options = data?.result.map((state: stateType) => ({
    stateId: state.stateId,
    stateName: state.stateName,
    stateValue: state.stateValue,
  })) as stateType[]

  // setting the default location
  useEffect(() => {
    if (options?.length && !state.stateId) {
      setState(options[0])
    }
  }, [options, state, setState, isLoading])

  if (isError) {
    return (
      <div className="flex justify-center w-full h-screen pt-64 text-3xl text-red-500 bg-white ">
        Error fetching states :\ <br />
        {error?.message}
      </div>
    )
  }

  return (
    <>
      <Navbar options={options} isLoading={isLoading} />
      <Sidebar />
      <MainWrapper>
        {isLoading ? (
          <div>
            <StatesLoadingSkelton />
          </div>
        ) : (
          <Outlet />
        )}
      </MainWrapper>
    </>
  )
}
