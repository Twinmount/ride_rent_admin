import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchAllCities } from "@/api/cities";

type CityType = {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

type CitiesDropdownProps = {
  value: string[];
  onChangeHandler: (value: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  stateId: string;
};

const CitiesDropdown = ({
  value = [],
  onChangeHandler,
  placeholder = "cities",
  isDisabled = false,
  stateId,
}: CitiesDropdownProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["cities", stateId],
    queryFn: () => fetchAllCities(stateId),
    enabled: !!stateId,
  });

  const [cities, setCities] = useState<CityType[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>(value || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (data) {
      setCities(data.result);
    }
  }, [data]);

  useEffect(() => {
    if (value) {
      setSelectedCities(value);
    }
  }, [value]);

  const handleSelectCity = (cityId: string) => {
    let updatedSelectedCities: string[];

    if (selectedCities.includes(cityId)) {
      updatedSelectedCities = selectedCities.filter((id) => id !== cityId);
    } else {
      updatedSelectedCities = [...selectedCities, cityId];
    }

    setSelectedCities(updatedSelectedCities);
    onChangeHandler(updatedSelectedCities);
  };

  // copy city name
  const handleCopyCities = () => {
    const selectedCityNames = selectedCities
      .map((cityId) => cities.find((city) => city.cityId === cityId)?.cityName)
      .filter(Boolean) // Filter out any undefined values
      .join(", ");

    navigator.clipboard.writeText(selectedCityNames);
    setIsCopied(true); // Set copied state to true

    // Revert back to original state after 3 seconds
    setTimeout(() => setIsCopied(false), 3000);
  };

  const filteredCities = cities.filter((city) =>
    city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-x-2 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={false}
            disabled={isDisabled || isLoading || !stateId}
            className="justify-between w-full font-normal"
          >
            {!stateId
              ? "choose a state first"
              : isLoading
              ? "fetching cities..."
              : selectedCities.length > 0
              ? `${selectedCities.length} cities selected`
              : `Choose ${placeholder}`}
            <ChevronDown className="w-6 h-6 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="md:!w-96 p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${placeholder}...`}
              onValueChange={(query) => setSearchTerm(query)}
            />
            <CommandList>
              {filteredCities.length === 0 ? (
                <CommandEmpty>No {placeholder} found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredCities.map((city) => (
                    <CommandItem
                      key={city.cityId}
                      value={city.cityId}
                      onSelect={() => handleSelectCity(city.cityId)}
                      className="flex gap-x-2 items-center mt-1"
                    >
                      <Checkbox
                        checked={selectedCities.includes(city.cityId)}
                        onCheckedChange={() => handleSelectCity(city.cityId)}
                        className="bg-white data-[state=checked]:bg-yellow data-[state=checked]:border-none "
                      />
                      {city.cityName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Copy Button */}
      <Button
        variant="outline"
        onClick={handleCopyCities}
        disabled={selectedCities.length === 0}
        className="flex gap-2 items-center"
        type="button"
      >
        {isCopied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-yellow" />
        )}
        {isCopied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
};

export default CitiesDropdown;
