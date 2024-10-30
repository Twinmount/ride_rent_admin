import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

// Define service options
const SERVICE_OPTIONS = [
  {
    typeId: "429e89be-7a73-40d3-b149-a9c62b531d6b",
    label: "Car with Driver",
    value: "car-with-driver",
  },
  {
    typeId: "1373249a-9fca-4387-b6a3-1decc434e726",
    label: "Airport Pickup",
    value: "airport-pickup",
  },
  {
    typeId: "de553fb6-84a5-46a4-8e27-71640dfb7b74",
    label: "Monthly Rentals",
    value: "monthly-rentals",
  },
];

type ServicesDropdownProps = {
  value: string[];
  onChangeHandler: (value: string[]) => void;
  isDisabled?: boolean;
  vehicleTypeId: string;
};

const ServicesDropdown = ({
  value = [],
  onChangeHandler,
  isDisabled = false,
  vehicleTypeId,
}: ServicesDropdownProps) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    value || []
  );

  // Filter service options based on vehicleTypeId selection
  const filteredServices = SERVICE_OPTIONS.filter(
    (service) =>
      service.typeId !== vehicleTypeId ||
      selectedServices.includes(service.typeId)
  );

  useEffect(() => {
    // Update selectedServices if vehicleTypeId is in selected services
    if (selectedServices.includes(vehicleTypeId)) {
      const updatedSelectedServices = selectedServices.filter(
        (serviceId) => serviceId !== vehicleTypeId
      );
      setSelectedServices(updatedSelectedServices);
      onChangeHandler(updatedSelectedServices);
    }
  }, [vehicleTypeId]); // Only re-run when vehicleTypeId changes

  const handleSelectService = (serviceId: string) => {
    let updatedSelectedServices: string[];

    if (selectedServices.includes(serviceId)) {
      updatedSelectedServices = selectedServices.filter(
        (id) => id !== serviceId
      );
    } else {
      updatedSelectedServices = [...selectedServices, serviceId];
    }

    setSelectedServices(updatedSelectedServices);
    onChangeHandler(updatedSelectedServices);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          disabled={isDisabled || !vehicleTypeId}
          className="justify-between w-full font-normal"
        >
          {!vehicleTypeId
            ? "choose a vehicle type first"
            : selectedServices.length > 0
            ? `${selectedServices.length} services selected`
            : `Choose services offered`}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command shouldFilter={false}>
          <CommandList>
            {filteredServices.length === 0 ? (
              <CommandEmpty>No services found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredServices.map((service) => (
                  <CommandItem
                    key={service.typeId}
                    value={service.typeId}
                    onSelect={() => handleSelectService(service.typeId)}
                    className="flex gap-x-2 items-center mt-1"
                  >
                    <Checkbox
                      checked={selectedServices.includes(service.typeId)}
                      onCheckedChange={() =>
                        handleSelectService(service.typeId)
                      }
                      className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none "
                    />
                    {service.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ServicesDropdown;
