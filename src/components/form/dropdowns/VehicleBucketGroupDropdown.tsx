// components/dropdowns/VehicleBucketGroupDropdown.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleBucketDisplayGroupType } from "@/types/types";

type VehicleBucketGroupDropdownProps = {
  onChangeHandler: (value: VehicleBucketDisplayGroupType) => void;
  value?: string;
  placeholder?: string;
  className?: string;
};

export default function VehicleBucketGroupDropdown({
  onChangeHandler,
  value,
  placeholder = "Select display group type",
  className,
}: VehicleBucketGroupDropdownProps) {
  return (
    <Select onValueChange={onChangeHandler} value={value}>
      <SelectTrigger
        className={`select-field input-fields text-left ring-0 focus:ring-0 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="POPULAR_RENTAL_SEARCHES">
          Popular Rental Searches (Left Box)
        </SelectItem>
        <SelectItem value="POPULAR_VEHICLE_PAGES">
          Popular Vehicle Pages (Right Box)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
