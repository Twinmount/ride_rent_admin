import { getCompanyListingsCount } from '@/api/company'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function CompanyNavDropdown() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['company-listing-count'],
    queryFn: () => getCompanyListingsCount(),
  })

  // Destructure data from API response
  const companyCounts = data?.result || {
    all: 0,
    pending: 0,
    rejected: 0,
    approved: 0,
    total: 0,
  }

  // Derive the current registration status based on the current path
  const currentStatus = (() => {
    if (location.pathname.includes('/registrations/new'))
      return 'New Registrations'
    if (location.pathname.includes('/registrations/rejected'))
      return 'Rejected Registrations'
    return 'Live Companies'
  })()

  return (
    <DropdownMenu onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button className="text-2xl font-bold bg-transparent text-yellow hover:bg-transparent hover:text-yellow">
          {currentStatus}&nbsp;
          <ChevronDown
            size={20}
            strokeWidth={3}
            className="relative ml-1 top-1"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-28">
        <DropdownMenuLabel>Select Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentStatus}
          onValueChange={(value) => {
            setTimeout(() => {
              switch (value) {
                case 'New':
                  navigate('/registrations/new')
                  break
                case 'Rejected':
                  navigate('/registrations/rejected')
                  break
                default:
                  navigate('/registrations')
              }
            }, 200) // Add a delay of 200 milliseconds
          }}
        >
          <DropdownMenuRadioItem
            value="Live Companies"
            className={`relative ${
              currentStatus === 'Live Companies' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Live ({companyCounts.approved})
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="New Registrations"
            className={`relative ${
              currentStatus === 'New Registrations' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            New ({companyCounts.pending})
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Rejected Registrations"
            className={`relative ${
              currentStatus === 'Rejected Registrations' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Rejected ({companyCounts.rejected})
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
