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
import { ChevronDown } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

type ListingStatus = 'All' | 'New' | 'Updated' | 'Pending' | 'Rejected'

export function ListingsNavDropdown() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive the current listing status based on the current path
  const currentStatus: ListingStatus = (() => {
    if (location.pathname.includes('/listings/new')) return 'New'
    if (location.pathname.includes('/listings/updated')) return 'Updated'
    if (location.pathname.includes('/listings/pending')) return 'Pending'
    if (location.pathname.includes('/listings/rejected')) return 'Rejected'
    return 'All'
  })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-2xl font-bold bg-transparent text-yellow hover:bg-transparent hover:text-yellow">
          {currentStatus}&nbsp;Listings{' '}
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
                  navigate('/listings/all')
              }
            }, 150)
          }}
        >
          <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="New">New</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Updated">Updated</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Rejected">
            Rejected
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
