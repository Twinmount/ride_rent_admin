import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAdminContext } from "@/context/AdminContext";
import { NavbarStateType } from "@/types/types";

import { ChevronDown, MapPin } from "lucide-react";
import NotificationIndicator from "./general/NotificationIndicator";

type DropdownProps = {
  options: NavbarStateType[];
  isLoading: boolean;
};

const StatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { state, setState } = useAdminContext();

  // Check if any state has newVehicles or updatedVehicles
  const hasNewOrUpdatedVehicles =
    !isLoading &&
    options.some(
      (option) => option.newVehicles > 0 || option.updatedVehicles > 0
    );

  const handleSelect = (option: NavbarStateType) => {
    const { stateName, stateValue, stateId } = option;

    setState({ stateName, stateValue, stateId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`!outline-none !border-none cursor-pointer min-w-32 w-fit ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
        disabled={isLoading}
      >
        <div className="flex relative items-center pr-1 pl-4 h-10 font-semibold tracking-wider whitespace-nowrap rounded-3xl outline">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading ? "Loading..." : state?.stateName || "Select a state"}
          {!isLoading && (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          )}
          {/* Render NotificationIndicator in DropdownMenuTrigger */}
          {!isLoading && hasNewOrUpdatedVehicles && (
            <NotificationIndicator className="absolute top-0 right-2" />
          )}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-40">
          <DropdownMenuLabel className="mb-2 font-bold bg-slate-100">
            Choose location
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`font-semibold relative cursor-pointer flex items-center justify-between ${
                  option.stateValue === state?.stateValue
                    ? "!text-white bg-slate-900 hover:!bg-slate-900"
                    : "hover:!bg-gray-300 text-black"
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
  );
};

export default StatesDropdown;
