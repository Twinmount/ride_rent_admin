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

type VehicleTypesDropdownProps = {
  vehicleCategoryId: string | undefined
  value?: string
  onChangeHandler: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

type VehicleType = {
  typeId: string
  name: string
  value: string
}

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

  // IDs of service options to be excluded from vehicle types dropdown
  const SERVICE_OPTION_IDS = [
    "429e89be-7a73-40d3-b149-a9c62b531d6b", // Car with Driver
    "1373249a-9fca-4387-b6a3-1decc434e726", // Airport Pickup
    "de553fb6-84a5-46a4-8e27-71640dfb7b74", // Monthly Rentals
    "029703ed-928a-4cf0-8c0e-d160670b12da", // Self Driving
  ];

  return (
    <Select
      onValueChange={onChangeHandler}
      value={value} // Handle default value selection
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
}

export default VehicleTypesDropdown
