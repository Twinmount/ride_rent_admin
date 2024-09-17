import { getCompanyListingsCount } from '@/api/company'
import { BellPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAdminContext } from '@/context/AdminContext'
import NotificationIndicator from './NotificationIndicator'

const AgentsSidebarBox = () => {
  const { toggleSidebar } = useAdminContext()
  const location = useLocation()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['company-listing-count'],
    queryFn: getCompanyListingsCount,
  })

  const companyCounts = data?.result || { pending: 0 }

  const handleClick = () => {
    navigate('/registrations')
    toggleSidebar()
  }

  const isActive = location.pathname.startsWith('/registrations')

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
    >
      <BellPlus className="text-xl" size={20} strokeWidth={3} />
      <span className="font-medium">Agents</span>
      {!isActive && companyCounts.pending > 0 && <NotificationIndicator />}
    </div>
  )
}

export default AgentsSidebarBox
