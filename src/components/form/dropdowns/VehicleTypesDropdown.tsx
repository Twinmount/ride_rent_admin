import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchAllVehicleTypes } from '@/api/vehicle-types'
import { SERVICE_OPTIONS } from "@/constants";

type VehicleTypesDropdownProps = {
  vehicleCategoryId: string | undefined;
  value?: string;
  onChangeHandler: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
};

type VehicleType = {
  typeId: string;
  name: string;
  value: string;
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
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    if (data) {
      setVehicleTypes(data.result.list);
    }
  }, [data]);

  const getPlaceholderText = () => {
    if (isLoading) {
      return "Fetching types...";
    } else if (!vehicleCategoryId) {
      return "choose a vehicle category first";
    } else if (!vehicleTypes.length) {
      return "No vehicle types found";
    } else {
      return "Choose vehicle type";
    }
  };

  const SERVICE_OPTION_IDS = SERVICE_OPTIONS.map((option) => option.typeId);

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
        disabled={isDisabled || isLoading || !vehicleCategoryId}
      >
        <SelectValue
          className="!font-bold !text-black"
          placeholder={getPlaceholderText()}
        />
      </SelectTrigger>

      <SelectContent>
        {vehicleTypes.length > 0 &&
          vehicleTypes
            .filter((type) => !SERVICE_OPTION_IDS.includes(type.typeId))
            .map((type) => (
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


export default VehicleTypesDropdown
