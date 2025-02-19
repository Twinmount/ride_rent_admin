import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, MapPin } from "lucide-react";

import { StateType } from "@/types/api-types/vehicleAPI-types";

type DropdownProps = {
  options: StateType[];
  isLoading: boolean;
  selectedState?: StateType | null;
  setSelectedState?: (state: StateType) => void;
};

const GeneralStatesDropdown = ({
  options,
  isLoading,
  selectedState,
  setSelectedState,
}: DropdownProps) => {
  // Check if any state has newVehicles or updatedVehicles

  const handleSelect = (option: StateType) => {
    setSelectedState && setSelectedState(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`w-fit min-w-32 cursor-pointer !border-none !outline-none ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-2xl bg-slate-800 pl-4 pr-1 font-semibold tracking-wider text-white outline">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading
            ? "Loading..."
            : selectedState?.stateName || "Select a state"}
          {!isLoading && (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          )}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-40">
          {options.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`relative flex cursor-pointer items-center justify-between font-semibold ${
                  option.stateValue === selectedState?.stateValue
                    ? "bg-slate-900 !text-white hover:!bg-slate-900"
                    : "text-black hover:!bg-gray-300"
                }`}
              >
                {option.stateName}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default GeneralStatesDropdown;
