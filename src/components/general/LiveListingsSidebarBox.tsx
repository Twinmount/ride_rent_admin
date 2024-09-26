import { getVehicleListingsCountByState } from '@/api/vehicle'
import { List } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAdminContext } from '@/context/AdminContext'
import NotificationIndicator from './NotificationIndicator'

const LiveListingsSidebar = () => {
  const { toggleSidebar } = useAdminContext()
  const location = useLocation()
  const navigate = useNavigate()

  const { state } = useAdminContext()

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-listing-count-by-state', state.stateId],
    queryFn: () => getVehicleListingsCountByState(state.stateId),
    staleTime: 5 * 60 * 1000,
    enabled: !!state.stateId && typeof state.stateId === 'string',
  })

  const listingCounts = data?.result || { newVehicle: 0, updated: 0 }

  const handleClick = () => {
    navigate('/listings')
    toggleSidebar()
  }

  const isActive = location.pathname.startsWith('/listings')

  const inNotificationEnable =
    (!isLoading && listingCounts.newVehicle > 0) || listingCounts.updated > 0

  return (
    <div
      onClick={handleClick}
      className={`w-[95%] relative mx-auto flex whitespace-nowrap items-center gap-2 h-12 py-2 px-4 rounded-lg transition-all duration-100 ease-out ${
        isActive
          ? 'bg-yellow text-white hover:text-white'
          : 'hover:text-yellow hover:bg-slate-100'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <List className="text-xl" size={20} strokeWidth={3} />
      <span className="font-medium">Live Listings</span>
      {inNotificationEnable && (
        <NotificationIndicator dotColor={isActive ? 'white' : 'yellow'} />
      )}
    </div>
  )
}

export default LiveListingsSidebar
