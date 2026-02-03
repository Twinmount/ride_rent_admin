import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VEHICLE_BUCKET_MODES, VehicleBucketModeType } from "@/constants";

type VehicleBucketModeDropdownProps = {
  onChangeHandler: (value: VehicleBucketModeType) => void;
  value?: VehicleBucketModeType;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function VehicleBucketModeDropdown({
  onChangeHandler,
  value,
  placeholder = "Select bucket mode",
  className,
  disabled = false,
}: VehicleBucketModeDropdownProps) {
  return (
    <Select onValueChange={onChangeHandler} value={value} disabled={disabled}>
      <SelectTrigger
        className={`select-field input-fields text-left ring-0 focus:ring-0 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {VEHICLE_BUCKET_MODES.map((mode) => (
          <SelectItem key={mode.value} value={mode.value}>
            <div className="flex flex-col">
              <span className="font-medium">{mode.label}</span>
              <span className="text-xs text-gray-500">{mode.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
