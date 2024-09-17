import { getVehicleListingsCount } from '@/api/vehicle'
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
import NotificationIndicator from './general/NotificationIndicator'
import { useState } from 'react'

type ListingStatus = 'Live' | 'New' | 'Updated' | 'Pending' | 'Rejected'

export function ListingsNavDropdown() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['vehicle-listing-count'],
    queryFn: () => getVehicleListingsCount(),
  })

  // Destructure data from API response
  const listingCounts = data?.result || {
    all: 0,
    newVehicle: 0,
    updated: 0,
    pending: 0,
    rejected: 0,
    approved: 0,
    total: 0,
  }

  // Derive the current listing status based on the current path
  const currentStatus: ListingStatus = (() => {
    if (location.pathname.includes('/listings/new')) return 'New'
    if (location.pathname.includes('/listings/updated')) return 'Updated'
    if (location.pathname.includes('/listings/pending')) return 'Pending'
    if (location.pathname.includes('/listings/rejected')) return 'Rejected'
    return 'Live'
  })()

  return (
    <DropdownMenu onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button className="relative text-2xl font-bold bg-transparent text-yellow hover:bg-transparent hover:text-yellow">
          {currentStatus}&nbsp;Listings{' '}
          {!isOpen && listingCounts.newVehicle > 0 && <NotificationIndicator />}{' '}
          {/* Render NotificationIndicator if new listings exist */}
          <ChevronDown
            size={20}
            strokeWidth={3}
            className="relative ml-1 top-1"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-28">
        <DropdownMenuLabel>Select Listing</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentStatus}
          onValueChange={(value) => {
            setTimeout(() => {
              switch (value) {
                case 'New':
                  navigate('/listings/new')
                  break
                case 'Updated':
                  navigate('/listings/updated')
                  break
                case 'Pending':
                  navigate('/listings/pending')
                  break
                case 'Rejected':
                  navigate('/listings/rejected')
                  break
                default:
                  navigate('/listings/live')
              }
            }, 150)
          }}
        >
          {/* Applying active class "text-yellow" and hover classes */}
          <DropdownMenuRadioItem
            value="Live"
            className={`relative ${
              currentStatus === 'Live' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Live ({listingCounts.approved})
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="New"
            className={`relative ${
              currentStatus === 'New' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            New ({listingCounts.newVehicle})
            {listingCounts.newVehicle > 0 && <NotificationIndicator />}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Updated"
            className={`relative ${
              currentStatus === 'Updated' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Updated ({listingCounts.updated})
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Pending"
            className={`relative ${
              currentStatus === 'Pending' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Pending ({listingCounts.pending})
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Rejected"
            className={`relative ${
              currentStatus === 'Rejected' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Rejected ({listingCounts.rejected})
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
