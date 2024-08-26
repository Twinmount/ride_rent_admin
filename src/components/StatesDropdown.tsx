import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAdminContext } from '@/context/AdminContext'
import { stateType } from '@/types/types'

import { ChevronDown, MapPin } from 'lucide-react'

type DropdownProps = {
  options: stateType[]
  isLoading: boolean
}

const StatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { state, setState } = useAdminContext()

  const handleSelect = (option: stateType) => {
    setState(option)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`!outline-none !border-none cursor-pointer min-w-32 w-fit ${
          isLoading ? 'pointer-events-none opacity-50' : ''
        }`}
        disabled={isLoading}
      >
        <div className="flex items-center h-10 pl-4 pr-1 font-semibold tracking-wider outline rounded-3xl whitespace-nowrap">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading ? 'Loading...' : state?.stateName || 'Select a state'}
          {!isLoading && <ChevronDown className="ml-4" />}
        </div>
      </DropdownMenuTrigger>
      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-44">
          <DropdownMenuLabel className="mb-2 font-bold bg-slate-100">
            Choose location
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`font-semibold cursor-pointer ${
                  option.stateValue === state?.stateValue
                    ? '!text-white bg-slate-900 hover:!bg-slate-900'
                    : 'hover:!bg-gray-300 text-black'
                }`}
              >
                {option.stateValue}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
export default StatesDropdown
