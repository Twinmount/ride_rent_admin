import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { revertSlugToString } from "@/lib/utils";
import { searchVehicleSeries } from "@/api/vehicle-series";

type VehicleSeriesSearchProps = {
  value?: string;
  vehicleBrandId: string;
  stateId: string;
  onChangeHandler: (data: {
    seriesLabel: string;
    heading?: string;
    subHeading?: string;
    infoTitle?: string;
    infoDescription?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) => void;
  placeholder?: string;
};

const VehicleSeriesSearch = ({
  value = "",
  vehicleBrandId,
  stateId,
  onChangeHandler,
  placeholder = "Search series...",
}: VehicleSeriesSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value || ""); // Updates instantly
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // Delayed state for API call
  const [open, setOpen] = useState(false);

  // Fetch series data when debouncedSearchTerm changes
  const { data, isFetching } = useQuery({
    queryKey: ["searchSeries", vehicleBrandId, debouncedSearchTerm],
    queryFn: async () =>
      await searchVehicleSeries({
        vehicleSeries: debouncedSearchTerm,
        brandId: vehicleBrandId,
        stateId,
      }),
    enabled:
      !!vehicleBrandId && !!stateId && !!(debouncedSearchTerm.length > 1), // Only fetch if valid search term , as well as brandId and stateId are provided
    staleTime: 0,
  });

  // Effect to update `debouncedSearchTerm` only after user stops typing for 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Debounce delay

    return () => {
      clearTimeout(handler); // Clear timeout if user types again
    };
  }, [searchTerm]); // Runs when `searchTerm` changes

  // Handle input change (updates immediately)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9-\s]/g, ""); // Allow letters, numbers, hyphens, and spaces
    setSearchTerm(sanitizedValue); // Update input field immediately
  };

  const handleSelect = (
    seriesLabel: string,
    heading: string = "",
    subHeading: string = "",
    infoTitle: string = "",
    infoDescription: string = "",
    metaTitle: string = "",
    metaDescription: string = "",
  ) => {
    setSearchTerm(seriesLabel);
    setOpen(false);
    onChangeHandler({
      seriesLabel,
      heading,
      subHeading,
      infoTitle,
      infoDescription,
      metaTitle,
      metaDescription,
    });
  };

  const seriesData = data?.result || [];

  // Popover placeholder logic via immediately invoked function expression (IIFE)
  const popoverPlaceholder = (() => {
    if (isFetching) {
      return "Fetching series...";
    } else if (!stateId) {
      return "Choose a state first";
    } else if (!vehicleBrandId) {
      return "Choose a brand first";
    } else {
      return "Search series...";
    }
  })();

  const isNewSeries =
    searchTerm.trim().length > 0 &&
    !seriesData.some(
      (series) =>
        revertSlugToString(series.vehicleSeries).toLowerCase().trim() ===
        searchTerm.toLowerCase().trim(),
    );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={!vehicleBrandId}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || popoverPlaceholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-full">
          <Command>
            <Input
              value={searchTerm}
              placeholder={placeholder}
              onChange={handleInputChange}
              className="h-10 w-full border border-gray-300 text-sm outline-none focus-within:border-gray-400 focus-within:ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <CommandList>
              {isFetching ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : seriesData.length > 0 ? (
                <CommandGroup>
                  {isNewSeries && (
                    <CommandItem
                      key="manual-entry"
                      onSelect={() => handleSelect(searchTerm, "", "")}
                      className="mb-1 border"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold italic">
                          Add new series "{searchTerm}"
                        </span>
                        <span className="text-sm text-gray-500">
                          Add this new series under the selected brand.
                        </span>
                      </div>
                    </CommandItem>
                  )}
                  {seriesData.map((series) => (
                    <CommandItem
                      key={series.vehicleSeriesId}
                      className="mb-1 flex items-center justify-between border"
                      onSelect={() =>
                        handleSelect(
                          series.vehicleSeriesLabel,
                          series.vehicleSeriesPageHeading,
                          series.vehicleSeriesPageSubheading,
                          series.vehicleSeriesInfoTitle,
                          series.vehicleSeriesInfoDescription,
                          series.vehicleSeriesMetaTitle,
                          series.vehicleSeriesMetaDescription,
                        )
                      }
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {revertSlugToString(series.vehicleSeries)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {series.vehicleSeriesMetaTitle}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : searchTerm.length ? (
                <CommandItem
                  key="manual-entry"
                  onSelect={() => handleSelect(searchTerm, "", "")}
                  className="mb-1 border"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">Add "{searchTerm}"</span>
                    <span className="text-sm text-gray-500">
                      Add this new series under the selected brand.
                    </span>
                  </div>
                </CommandItem>
              ) : (
                <CommandEmpty>Search or enter a series </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default VehicleSeriesSearch;
