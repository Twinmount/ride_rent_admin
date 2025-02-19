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

const NavbarStatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { state, setState } = useAdminContext();

  // Check if any state has newVehicles or updatedVehicles
  const hasNewOrUpdatedVehicles =
    !isLoading &&
    options.some(
      (option) => option.newVehicles > 0 || option.updatedVehicles > 0,
    );

  const handleSelect = (option: NavbarStateType) => {
    const { stateName, stateValue, stateId } = option;

    setState({ stateName, stateValue, stateId });
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
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-3xl pl-4 pr-1 font-semibold tracking-wider outline">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading ? "Loading..." : state?.stateName || "Select a state"}
          {!isLoading && (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          )}
          {/* Render NotificationIndicator in DropdownMenuTrigger */}
          {!isLoading && hasNewOrUpdatedVehicles && (
            <NotificationIndicator className="absolute right-2 top-0" />
          )}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-40">
          <DropdownMenuLabel className="mb-2 bg-slate-100 font-bold">
            Choose location
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`relative flex cursor-pointer items-center justify-between font-semibold ${
                  option.stateValue === state?.stateValue
                    ? "bg-slate-900 !text-white hover:!bg-slate-900"
                    : "text-black hover:!bg-gray-300"
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

export default NavbarStatesDropdown;
