import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

type DropdownProps = {
  value?: string;
  onChangeHandler: (value: string) => void;
  options: { label: string; value: string }[];
  isDisabled?: boolean;
  isEngineType?: boolean;
};

const SpecificationDropdown = ({
  value,
  onChangeHandler,
  options,
  isDisabled = false,
  isEngineType = false,
}: DropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sort and filter options based on searchTerm and isEngineType
  // Memoize only the sorting of options if isEngineType is true
  const sortedOptions = useMemo(() => {
    return isEngineType
      ? [...options].sort((a, b) => a.label.localeCompare(b.label))
      : options;
  }, [options, isEngineType]);

  // Filter sorted options based on the searchTerm
  const filteredOptions = sortedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEngineType) console.log(filteredOptions);

  return (
    <Select onValueChange={onChangeHandler} value={value} disabled={isDisabled}>
      <SelectTrigger className="ring-0 select-field focus:ring-0 input-fields">
        <SelectValue
          className="!font-bold !text-black"
          placeholder={`Choose option`}
        />
      </SelectTrigger>

      <SelectContent>
        {isEngineType && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 w-full rounded border input-fields"
            />
          </div>
        )}
        {/* Filtered and sorted options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="select-item p-regular-14"
            >
              {option.label}
            </SelectItem>
          ))
        ) : (
          <p className="p-2 text-gray-500">No options found</p>
        )}
      </SelectContent>
    </Select>
  );
};

export default SpecificationDropdown;
