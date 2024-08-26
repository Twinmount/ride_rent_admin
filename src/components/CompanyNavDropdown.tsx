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

type RegistrationStatus = 'All' | 'New' | 'Rejected'

export function CompanyNavDropdown() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive the current registration status based on the current path
  const currentStatus: RegistrationStatus = (() => {
    if (location.pathname.includes('/registrations/new')) return 'New'
    if (location.pathname.includes('/registrations/rejected')) return 'Rejected'
    return 'All'
  })()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-2xl font-bold bg-transparent text-yellow hover:bg-transparent hover:text-yellow">
          {currentStatus}&nbsp;Registrations{' '}
          <ChevronDown
            size={20}
            strokeWidth={3}
            className="relative ml-1 top-1"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Select Registration</DropdownMenuLabel>
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
          <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="New">New</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="Rejected">
            Rejected
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
