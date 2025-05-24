import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin, Search, Loader2 } from "lucide-react";
import { StateType } from "@/types/api-types/vehicleAPI-types";
import { useEffect, useRef, useState } from "react";
import { Draft } from "immer";

type filterType = {
  count: number | null;
  searchTerm: string | null;
};

type SetFilterType = (recipe: (draft: Draft<filterType>) => void) => void;

type DropdownProps = {
  options: StateType[];
  isLoading: boolean;
  selectedState?: StateType | null;
  setSelectedState?: any;
  setFilter?: SetFilterType;
};

const GeneralStatesDropdown = ({
  options,
  isLoading,
  selectedState,
  setSelectedState,
  setFilter,
}: DropdownProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<StateType[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (options) {
      const defaultState = options.find(
        (state) => state.stateValue === "dubai",
      );
      if (defaultState) {
        setSelectedState(defaultState);
      } else if (!selectedState?.stateId && options.length > 0) {
        setSelectedState(options[0]);
      }
    }
  }, [options]);

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

  // Debounce search term update
  useEffect(() => {
    if (setFilter) {
      debounceTimer.current = setTimeout(() => {
        setFilter((draft) => {
          draft.searchTerm = searchInput.trim() === "" ? null : searchInput;
        });
      }, 500);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput, setFilter]);

  const handleSelect = (option: StateType) => {
    setSelectedState && setSelectedState(option);
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
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-2xl bg-slate-800 pl-4 pr-1 font-semibold tracking-wider text-white outline">
          <MapPin className="mr-2 text-yellow" size={20} />
          {isLoading
            ? "Loading..."
            : selectedState?.stateName || "Select a state"}
          {!isLoading ? (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          ) : (
            <Loader2 className="relative top-1 ml-1 h-4 w-4 animate-spin" />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="ml-8 w-40"
        ref={dropdownRef}
        onInteractOutside={(e) => {
          // Prevent closing when clicking on search input or during loading
          if ((e.target as HTMLElement).closest("input") || isLoading) {
            e.preventDefault();
          }
        }}
        forceMount // Keep content mounted even when closed
      >
        <div className="relative mx-2 my-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
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

        {isLoading ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
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
          ))
        ) : (
          <div className="px-2 py-1.5 text-center text-sm text-gray-500">
            {options.length === 0
              ? "No states available"
              : "No matching states found"}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GeneralStatesDropdown;
