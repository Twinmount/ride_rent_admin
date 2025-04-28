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

import { ChevronDown, MapPin, Search } from "lucide-react";
import NotificationIndicator from "./general/NotificationIndicator";
import { useEffect, useRef, useState } from "react";

type DropdownProps = {
  options: NavbarStateType[];
  isLoading: boolean;
};

const NavbarStatesDropdown = ({ options, isLoading }: DropdownProps) => {
  const { state, setState } = useAdminContext();
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<NavbarStateType[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if any state has newVehicles or updatedVehicles
  const hasNewOrUpdatedVehicles =
    !isLoading &&
    options.some(
      (option) => option.newVehicles > 0 || option.updatedVehicles > 0,
    );

  // Filter options based on search term
  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(
        (option) =>
          option.stateName.toLowerCase().includes(searchInput.toLowerCase()) ||
          option.stateValue.toLowerCase().includes(searchInput.toLowerCase()),
      );
      setFilteredOptions(filtered);
    }
  }, [searchInput, options]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleSelect = (option: NavbarStateType) => {
    const { stateName, stateValue, stateId } = option;
    setState({ stateName, stateValue, stateId });
    localStorage.setItem("selectedState", JSON.stringify(option)); // Store in localStorage
    setSearchInput("");
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        asChild
        className={`w-fit min-w-32 cursor-pointer !border-none !outline-none ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-3xl pr-1 font-semibold tracking-wider outline">
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
        <DropdownMenuContent
          className="ml-8 w-40"
          ref={dropdownRef}
          onInteractOutside={(e) => {
            // Prevent closing when clicking on search input
            if ((e.target as HTMLElement).closest("input")) {
              e.preventDefault();
            }
          }}
          forceMount
        >
          <DropdownMenuLabel className="mb-2 bg-slate-100 font-bold">
            Choose location
          </DropdownMenuLabel>

          <div className="relative mx-2 my-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search states..."
              className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={isLoading}
            />
          </div>
          <DropdownMenuSeparator />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
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
            ))
          ) : (
            <div className="px-2 py-1.5 text-center text-sm text-gray-500">
              {options.length === 0
                ? "No states available"
                : "No matching states found"}
            </div>
          )}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default NavbarStatesDropdown;
