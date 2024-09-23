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
import { NavbarStateType, stateType } from '@/types/types'

import { ChevronDown, MapPin } from 'lucide-react'
import NotificationIndicator from './general/NotificationIndicator'

type DropdownProps = {
  options: NavbarStateType[]
  isLoading: boolean
}

const StatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { state, setState } = useAdminContext()

  const sampleOptions = [
    {
      stateName: 'DUBAI',
      stateValue: 'dubai',
      stateId: '3ca68ef7-07b0-47fb-b703-14ec63a579ea',
      newVehicles: 54,
      updatedVehicles: 49,
    },
    {
      stateName: 'SHARJAH',
      stateValue: 'sharjah',
      stateId: '136951e9-ce5c-426e-8ba6-32a930bcee60',
      newVehicles: 119,
      updatedVehicles: 38,
    },
    {
      stateName: 'ABU DHABI',
      stateValue: 'abu-dhabi',
      stateId: '617091bb-0e19-42d6-9be8-86cdee77b76f',
      newVehicles: 136,
      updatedVehicles: 23,
    },
    {
      stateName: 'AL AIN',
      stateValue: 'al-ain',
      stateId: '98f2300e-e1ec-45a1-baf4-33c56638abc2',
      newVehicles: 0,
      updatedVehicles: 0,
    },
    {
      stateName: 'RAS AL KHAIMA',
      stateValue: 'ras-al-khaima',
      stateId: 'b09dc3a3-3101-40e7-9640-d84064ad87b9',
      newVehicles: 91,
      updatedVehicles: 31,
    },
  ]

  // Check if any state has newVehicles or updatedVehicles
  const hasNewOrUpdatedVehicles = sampleOptions.some(
    (option) => option.newVehicles > 0 || option.updatedVehicles > 0
  )

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
        <div className="relative flex items-center h-10 pl-4 pr-1 font-semibold tracking-wider outline rounded-3xl whitespace-nowrap ">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading ? 'Loading...' : state?.stateName || 'Select a state'}
          {!isLoading && (
            <ChevronDown className="relative ml-1 top-1" width={15} />
          )}
          {/* Render NotificationIndicator in DropdownMenuTrigger */}
          {!isLoading && hasNewOrUpdatedVehicles && (
            <NotificationIndicator className="absolute top-0 right-2" />
          )}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && sampleOptions?.length > 0 && (
        <DropdownMenuContent className="w-40 ml-8">
          <DropdownMenuLabel className="mb-2 font-bold bg-slate-100">
            Choose location
          </DropdownMenuLabel>
          {sampleOptions.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`font-semibold relative cursor-pointer flex items-center justify-between ${
                  option.stateValue === state?.stateValue
                    ? '!text-white bg-slate-900 hover:!bg-slate-900'
                    : 'hover:!bg-gray-300 text-black'
                }`}
              >
                {option.stateName}
                {/* Render NotificationIndicator if newVehicles or updatedVehicles > 0 */}
                {(option.newVehicles > 0 || option.updatedVehicles > 0) && (
                  <NotificationIndicator />
                )}
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
