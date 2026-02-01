import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchAllVehicleTypes } from "@/api/vehicle-types";
import { SERVICE_OPTIONS } from "@/constants";

type VehicleTypesDropdownProps = {
  vehicleCategoryId: string | undefined;
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

const VehicleTypesDropdown = ({
  vehicleCategoryId,
  value,
  onChangeHandler,
  isDisabled = false,
}: VehicleTypesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicle-types", vehicleCategoryId],
    queryFn: () =>
      fetchAllVehicleTypes({
        page: 1,
        limit: 20,
        sortOrder: "ASC",
        vehicleCategoryId: vehicleCategoryId as string,
      }),
    enabled: !!vehicleCategoryId,
    staleTime: 1 * 60 * 1000,
  });

  const vehicleTypes = data?.result?.list || [];
  const SERVICE_OPTION_IDS = SERVICE_OPTIONS.map((option) => option.typeId);
  const filteredTypes = vehicleTypes.filter(
    (type) => !SERVICE_OPTION_IDS.includes(type.typeId),
  );

  const getPlaceholderText = () => {
    if (isLoading) return "Fetching types...";
    if (!vehicleCategoryId) return "Choose a vehicle category first";
    if (!filteredTypes.length) return "No vehicle types found";
    return "Choose vehicle type";
  };

  return (
    <Select
      onValueChange={onChangeHandler}
      value={value}
      disabled={isDisabled || isLoading || !vehicleCategoryId}
    >
      <SelectTrigger
        className={`select-field input-fields ring-0 focus:ring-0 ${
          (isDisabled || isLoading || !vehicleCategoryId) &&
          "!cursor-default !opacity-60"
        }`}
      >
        <SelectValue placeholder={getPlaceholderText()} />
      </SelectTrigger>

      <SelectContent>
        {filteredTypes.map((type) => (
          <SelectItem
            key={type.typeId}
            value={type.typeId}
            className="select-item p-regular-14"
          >
            {type.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleTypesDropdown;
