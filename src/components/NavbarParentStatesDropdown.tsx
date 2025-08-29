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
import { stateType } from "@/types/types";

import { ChevronDown, MapPin } from "lucide-react";

type DropdownProps = {
  options: stateType[];
  isLoading: boolean;
};

const NavbarParentStatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { parentState, setParentState } = useAdminContext();

  const handleSelect = (option: stateType) => {
    const { stateName, stateValue, stateId } = option;
    setParentState({ stateName, stateValue, stateId });
    localStorage.setItem("selectedParentState", JSON.stringify(parentState));
    localStorage.removeItem("selectedState");
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
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-3xl pr-1 font-semibold tracking-wider outline">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading
            ? "Loading..."
            : parentState?.stateName || "Select a state"}
          {!isLoading && (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          )}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-40">
          <DropdownMenuLabel className="mb-2 bg-slate-100 font-bold">
            Choose parentState
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuGroup key={option.stateId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`relative flex cursor-pointer items-center justify-between font-semibold ${
                  option.stateValue === parentState?.stateValue
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

export default NavbarParentStatesDropdown;
