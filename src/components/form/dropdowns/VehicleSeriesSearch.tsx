import { useState, useEffect, useCallback } from "react";
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
import { debounce, revertSlugToString } from "@/lib/utils";
import { searchSeries } from "@/api/vehicle-series";

type VehicleSeriesSearchProps = {
  value?: string;
  vehicleBrandId: string;
  onChangeHandler: (
    series: string,
    metaTitle?: string,
    metaDescription?: string
  ) => void;
  placeholder?: string;
};

const VehicleSeriesSearch = ({
  value = "",
  vehicleBrandId,
  onChangeHandler,
  placeholder = "Search series...",
}: VehicleSeriesSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value || ""); // Start with the current value
  const [open, setOpen] = useState(false);

  // Fetch series data
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["searchSeries", vehicleBrandId, searchTerm],
    queryFn: async () => await searchSeries(vehicleBrandId, searchTerm),
    enabled: false, // Initial fetch disabled
  });

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) refetch();
    }, 500),
    [refetch]
  );

  // Trigger API call when `searchTerm` changes
  useEffect(() => {
    if (searchTerm.trim()) debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Handle series selection
  const handleSelect = (
    series: string,
    metaTitle: string = "",
    metaDesc: string = ""
  ) => {
    setSearchTerm(series);
    setOpen(false);
    onChangeHandler(series, metaTitle, metaDesc); // Autofill meta fields or reset them
  };

  // Restrict input to letters, numbers, and hyphen only
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9-\s]/g, ""); // Allow letters, numbers, hyphens, and spaces

    setSearchTerm(sanitizedValue); // Update search term
    onChangeHandler(sanitizedValue); // Update parent state
  };

  const seriesData = data || []; // Ensure `data` is always an array

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!vehicleBrandId}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {vehicleBrandId
            ? value || placeholder // Show current value or placeholder
            : "Choose a brand first"}{" "}
          {/* Disabled message */}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 max-w-full">
        <Command>
          <Input
            value={searchTerm}
            placeholder={placeholder}
            onChange={handleInputChange}
            className="w-full border-b outline-none focus:ring-0 h-10 text-sm"
          />
          <CommandList>
            {isFetching ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : seriesData.length ? (
              <CommandGroup>
                {searchTerm && (
                  <CommandItem
                    key="manual-entry"
                    onSelect={() => handleSelect(searchTerm, "", "")}
                    className="border mb-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        Add new series "{searchTerm}"
                      </span>
                      <span className="text-sm text-gray-500">
                        Add this new series under the selected brand.
                      </span>
                    </div>
                  </CommandItem>
                )}
                {seriesData.map((series: any) => (
                  <CommandItem
                    key={series.name}
                    onSelect={() =>
                      handleSelect(
                        series.vehicleSeries,
                        series.vehicleSeriesMetaTitle,
                        series.vehicleSeriesMetaDescription
                      )
                    }
                    className="border mb-1"
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
              <>
                <CommandEmpty>No series found for "{searchTerm}".</CommandEmpty>
                {searchTerm && (
                  <CommandGroup>
                    <CommandItem
                      key="manual-entry"
                      onSelect={() => handleSelect(searchTerm)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          Add new series "{searchTerm}"
                        </span>
                        <span className="text-sm text-gray-500">
                          Add this new series under the selected brand.
                        </span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            ) : (
              <CommandEmpty>Search or enter a series </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VehicleSeriesSearch;
