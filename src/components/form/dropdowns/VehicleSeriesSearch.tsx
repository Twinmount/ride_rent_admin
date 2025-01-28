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
import { ChevronsUpDown, Edit3 } from "lucide-react";
import { debounce, revertSlugToString } from "@/lib/utils";
import { searchVehicleSeries } from "@/api/vehicle-series";
import VehicleSeriesDialog from "@/components/dialog/VehicleSeriesDialog";

type VehicleSeriesSearchProps = {
  value?: string;
  vehicleBrandId: string;
  onChangeHandler: (
    series: string,
    heading?: string,
    subHeading?: string,
    metaTitle?: string,
    metaDescription?: string,
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
  const [selectedSeries, setSelectedSeries] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog open state

  // Fetch series data
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["searchSeries", vehicleBrandId, searchTerm],
    queryFn: async () =>
      await searchVehicleSeries({
        vehicleSeries: searchTerm,
        brandId: vehicleBrandId,
      }),
    enabled: false, // Initial fetch disabled
  });

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) refetch();
    }, 500),
    [refetch],
  );

  // Trigger API call when `searchTerm` changes
  useEffect(() => {
    if (searchTerm.trim()) debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Restrict input to letters, numbers, and hyphen only
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^a-zA-Z0-9-\s]/g, ""); // Allow letters, numbers, hyphens, and spaces

    setSearchTerm(sanitizedValue); // Update search term
    onChangeHandler(sanitizedValue); // Update parent state
  };

  // Open dialog and set selected series
  const handleEditClick = (series: any) => {
    setSelectedSeries(series);
    setDialogOpen(true);
  };

  // Handle series selection
  const handleSelect = (
    series: string,
    heading: string = "",
    subHeading: string = "",
    metaTitle: string = "",
    metaDesc: string = "",
  ) => {
    setSearchTerm(series);
    setOpen(false);
    onChangeHandler(series, heading, subHeading, metaTitle, metaDesc); // Autofill meta fields or reset them
  };

  const seriesData = data?.result.list || [
    {
      vehicleSeriesId: "1",
      vehicleSeries: "series-1",
      vehicleSeriesMetaTitle: "Series 1 Meta Title",
      vehicleSeriesMetaDescription: "This is a description for Series 1.",
      vehicleSeriesPageHeading: "Series 1 Heading",
      vehicleSeriesPageSubheading: "Series 1 Subheading",
      seriesCode: "S1",
    },
    {
      vehicleSeriesId: "2",
      vehicleSeries: "series-2",
      vehicleSeriesMetaTitle: "Series 2 Meta Title",
      vehicleSeriesMetaDescription: "This is a description for Series 2.",
      vehicleSeriesPageHeading: "Series 2 Heading",
      vehicleSeriesPageSubheading: "Series 2 Subheading",
      seriesCode: "S2",
    },
  ]; // Ensure `data` is always an array

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
            {vehicleBrandId
              ? value || placeholder // Show current value or placeholder
              : "Choose a brand first"}{" "}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 max-w-full">
          <Command>
            <Input
              value={searchTerm}
              placeholder={placeholder}
              onChange={handleInputChange}
              className="h-10 w-full border-b text-sm outline-none focus:ring-0"
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
                      className="mb-1 border"
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
                      key={series.vehicleSeriesId}
                      className="mb-1 flex items-center justify-between border"
                      onSelect={() =>
                        handleSelect(
                          series.vehicleSeries,
                          series.vehicleSeriesPageHeading,
                          series.vehicleSeriesPageSubheading,
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
                      <Edit3
                        className="cursor-pointer text-gray-600 hover:text-gray-800"
                        onClick={() => handleEditClick(series)}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : searchTerm.length ? (
                <CommandEmpty>No series found for "{searchTerm}".</CommandEmpty>
              ) : (
                <CommandEmpty>Search or enter a series </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Dialog for editing vehicle series */}
      <VehicleSeriesDialog
        series={selectedSeries}
        brandId={vehicleBrandId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default VehicleSeriesSearch;
