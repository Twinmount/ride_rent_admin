import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useFetchStates } from "@/hooks/useFetchStates";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type StateType = {
  stateId: string;
  stateName: string;
  stateValue: string;
};

type SelectBoxProps = {
  value?: string;
  onChangeHandler: (value: StateType) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const StatesDropdown = ({
  onChangeHandler,
  value,
  isDisabled,
}: SelectBoxProps) => {
  const { isStateLoading, statesList: options, setFilter } = useFetchStates();
  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<StateType[]>(options);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (setFilter) {
      debounceTimer.current = setTimeout(() => {
        setFilter((draft) => {
          draft.searchTerm = searchInput.trim() === "" ? null : searchInput;
        });
      }, 700);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchInput, setFilter]);

  useEffect(() => {
    if (value) {
      setFilter((draft) => {
        draft.stateId = value;
        return draft;
      });
    }
  }, []);

  // removed dependency array on purpose
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    const search = searchInput.trim().toLowerCase();

    let filtered: StateType[] = options.filter((option) => {
      const matchesSearch =
        option.stateName.toLowerCase().includes(search) ||
        option.stateValue.toLowerCase().includes(search);

      const isNotSelected = option.stateId !== selectedState?.stateId;

      return (search === "" || matchesSearch) && isNotSelected;
    });

    if (selectedState) {
      filtered = [...filtered, selectedState];
    }

    setFilteredOptions(filtered);
  }, [searchInput, options]);

  const handleSelect = (value: string) => {
    const selectedOption = options.find((opt) => opt.stateId === value);
    if (selectedOption) {
      onChangeHandler(selectedOption);
      setSelectedState(selectedOption);
    }
  };

  const noMatchingStates =
    (filteredOptions.length === 0 && !selectedState) ||
    (filteredOptions.length === 1 &&
      filteredOptions[0].stateId === selectedState?.stateId &&
      !filteredOptions[0].stateName
        .toLowerCase()
        .includes(searchInput.toLowerCase()));

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={value}
      disabled={isDisabled || isStateLoading}
    >
      <SelectTrigger
        className="select-field input-fields ring-0 focus:ring-0"
        disabled={isDisabled}
      >
        <SelectValue
          className="!font-bold text-black"
          placeholder={isStateLoading ? "Loading..." : "Choose state"}
        />
      </SelectTrigger>

      <SelectContent className="z-[110] p-0">
        {/* Search Input */}
        <div className="sticky top-0 z-10 bg-white px-2 py-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search states..."
              className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={isStateLoading}
            />
          </div>
        </div>

        {/* States List */}
        {isStateLoading ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : filteredOptions.length > 0 ? (
          <>
            {filteredOptions.map(
              (state) =>
                state && (
                  <SelectItem
                    key={state.stateId}
                    value={state.stateId}
                    className="select-item p-regular-14"
                  >
                    {state.stateName}
                  </SelectItem>
                ),
            )}
            {noMatchingStates && (
              <div className="px-2 py-1.5 text-center text-sm text-gray-500">
                No matching states found
              </div>
            )}
          </>
        ) : noMatchingStates ? (
          <div className="px-2 py-1.5 text-center text-sm text-gray-500">
            No matching states found
          </div>
        ) : null}
      </SelectContent>
    </Select>
  );
};

export default StatesDropdown;
