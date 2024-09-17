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

export function MetaDataNavDropdown() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive the current page based on the current path
  const currentStatus = (() => {
    if (location.pathname.includes('/manage-meta-data/listing'))
      return 'Listing Page'
    if (location.pathname.includes('/manage-meta-data/vehicle-details'))
      return 'Vehicle Details Page'
    return 'Home Page'
  })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative mb-3 ml-4 text-2xl font-bold bg-transparent flex-center gap-x-2 text-yellow hover:bg-transparent">
          {currentStatus}&nbsp;Meta
          <ChevronDown className="w-6 h-6 text-white rounded-full bg-yellow " />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Select Page</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentStatus}
          onValueChange={(value) => {
            setTimeout(() => {
              switch (value) {
                case 'Home Page':
                  navigate('/manage-meta-data')
                  break
                case 'Listing Page':
                  navigate('/manage-meta-data/listing')
                  break
                default:
                  break
              }
            }, 150)
          }}
        >
          {/* Applying active class "text-yellow" and hover classes */}
          <DropdownMenuRadioItem
            value="Home Page"
            className={`relative ${
              currentStatus === 'Home Page' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            Home Page
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="Listing Page"
            className={`relative ${
              currentStatus === 'Listing Page' ? 'text-yellow' : ''
            } hover:bg-yellow hover:text-white`}
          >
            Listing Page
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
