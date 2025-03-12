import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { fetchAllSeries, fetchSeriesById } from "@/api/vehicle-series";
import { Link } from "react-router-dom";

type SeriesDropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  stateId: string;
  brandId: string;
};

const SeriesDropdown = ({
  value,
  onChangeHandler,
  placeholder = "series",
  isDisabled = false,
  stateId,
  brandId,
}: SeriesDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(value || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [open, setOpen] = useState(false);

  // Fetch brand by ID if value is provided
  const { data: specificSeriesData, isLoading: isSpecificSeriesLoading } =
    useQuery({
      queryKey: ["vehicle-series-by-id", value],
      queryFn: () => fetchSeriesById(value as string),
      enabled: !!value,
    });

  const { data: seriesData, isLoading: isSeriesLoading } = useQuery({
    queryKey: ["searchSeries", stateId, brandId, debouncedSearchTerm],
    queryFn: async () =>
      await fetchAllSeries({
        search: debouncedSearchTerm,
        brandId,
        stateId,
        page: 1,
      }),
    enabled: !!stateId && !!brandId && !!(debouncedSearchTerm.length > 1),
    staleTime: 0,
  });

  // Set the selected value based on the fetched specific brand
  useEffect(() => {
    if (specificSeriesData && specificSeriesData.result) {
      setSelectedValue(specificSeriesData.result.vehicleSeriesId);
    }
  }, [specificSeriesData]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  // Debounced handle search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout if user types again
    };
  }, [searchTerm]); // Runs when `searchTerm` changes

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue);
    if (onChangeHandler) onChangeHandler(currentValue);
  };

  const selectedSeriesName = useMemo(() => {
    // Prioritize loading states first
    if (isSpecificSeriesLoading || isSeriesLoading) return "Loading...";

    if (specificSeriesData?.result) {
      return specificSeriesData.result.vehicleSeriesLabel;
    }

    // Default text if nothing is found or loaded yet
    return `Choose ${placeholder}`;
  }, [selectedValue, specificSeriesData, isSpecificSeriesLoading]);

  const handleSearchTermChange = (value: string) => {
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setSearchTerm(value);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={isDisabled || !stateId}
          className="w-full justify-between font-normal"
        >
          {!stateId
            ? "Choose a state first"
            : !brandId
              ? "Choose a brand first"
              : isSeriesLoading || isSpecificSeriesLoading
                ? "Loading series..."
                : selectedSeriesName}
          <ChevronDown className="h-6 w-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 md:!w-96">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            onValueChange={(value) => handleSearchTermChange(value)}
          />
          <CommandList>
            {!searchTerm ? (
              <CommandEmpty>
                Please search the series under selected brand and state.
              </CommandEmpty>
            ) : isSeriesLoading ? (
              <CommandEmpty>Searching for {searchTerm}...</CommandEmpty>
            ) : seriesData?.result.list.length === 0 ? (
              <CommandEmpty>
                No {placeholder} found for{" "}
                <span className="italic">&apos;{searchTerm}&apos;</span>.
                <br />
                <Link
                  to="/manage-series/add"
                  className="font-[500] text-blue-500"
                >
                  Add new series?
                </Link>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {seriesData &&
                  seriesData.result.list.map((series) => (
                    <CommandItem
                      key={series.vehicleSeriesId}
                      value={series.vehicleSeriesId}
                      onSelect={() => {
                        handleSelect(series.vehicleSeriesId);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === series.vehicleSeriesId
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {series.vehicleSeriesLabel}
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

export default SeriesDropdown;
