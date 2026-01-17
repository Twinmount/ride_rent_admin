import { useState, useEffect, useRef } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchVehicles } from "@/api/vehicle-bucket";
import { cn } from "@/lib/utils";
import { useAdminContext } from "@/context/AdminContext";

type Vehicle = {
  id: string;
  vehicleCode: string;
  vehicleName: string;
  brandName: string;
  modelName: string;
  thumbnailUrl: string;
};

type VehicleMultiSelectDropdownProps = {
  selectedVehicleCodes: string[];
  onChange: (vehicleCodes: string[]) => void;
  maxSelections?: number;
};

export default function VehicleMultiSelectDropdown({
  selectedVehicleCodes = [],
  onChange,
  maxSelections = 20,
}: VehicleMultiSelectDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);

  const { state } = useAdminContext();

  // Store full vehicle objects to display details (like code)
  // key is vehicleCode
  const [selectedVehiclesMap, setSelectedVehiclesMap] = useState<
    Map<string, Vehicle>
  >(new Map());

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch vehicles when search query changes
  useEffect(() => {
    const fetchVehicles = async () => {
      if (debouncedSearchQuery.trim().length < 1) {
        setSearchResults([]);
        if (debouncedSearchQuery.length === 0) setIsDropdownOpen(false);
        return;
      }

      setIsSearching(true);
      try {
        const response: any = await searchVehicles(
          debouncedSearchQuery,
          state?.stateId,
        );
        const results = response.result || response || [];

        // Filter out already selected vehicles from the dropdown list
        // filtering by vehicleCode
        const filteredResults = Array.isArray(results)
          ? results.filter(
              (v: Vehicle) => !selectedVehicleCodes.includes(v.vehicleCode),
            )
          : [];

        setSearchResults(filteredResults);
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error searching vehicles:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchVehicles();
  }, [debouncedSearchQuery, selectedVehicleCodes, state?.stateId]);

  const handleSelectVehicle = (vehicle: Vehicle) => {
    if (selectedVehicleCodes.length >= maxSelections) return;

    // Update the map with the new vehicle details
    const newMap = new Map(selectedVehiclesMap);
    newMap.set(vehicle.vehicleCode, vehicle);
    setSelectedVehiclesMap(newMap);

    // Update parent with codes
    onChange([...selectedVehicleCodes, vehicle.vehicleCode]);

    // Clear search but keep dropdown open if needed or close it
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  const handleRemoveVehicle = (vehicleCode: string) => {
    const newCodes = selectedVehicleCodes.filter(
      (code) => code !== vehicleCode,
    );
    onChange(newCodes);

    const newMap = new Map(selectedVehiclesMap);
    newMap.delete(vehicleCode);
    setSelectedVehiclesMap(newMap);
  };

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* Container for pills and input */}
      <div className="relative w-full">
        {/* Container for pills and input */}
        <div
          className={cn(
            "relative flex min-h-[50px] w-full flex-wrap items-center gap-2 rounded-xl border border-input bg-white p-2 text-sm ring-offset-background transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            selectedVehicleCodes.length >= maxSelections && "opacity-90",
          )}
        >
          {/* Selected Pills */}
          {selectedVehicleCodes.map((code) => {
            return (
              <div
                key={code}
                className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <span className="text-xs uppercase">{code}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVehicle(code)}
                  className="ml-1 rounded-full p-0.5 hover:bg-black/10"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}

          {/* Search Input */}
          <div className="relative min-w-[120px] flex-1">
            <input
              type="text"
              className="w-full bg-transparent px-2 py-1 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                selectedVehicleCodes.length === 0
                  ? "Search by vehicle name or code..."
                  : "Add more..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0 || searchQuery.length > 0)
                  setIsDropdownOpen(true);
              }}
              disabled={selectedVehicleCodes.length >= maxSelections}
            />
          </div>

          {/* Loading Indicator */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2
                size={16}
                className="animate-spin text-muted-foreground"
              />
            </div>
          )}

          {!isSearching &&
            !searchQuery &&
            selectedVehicleCodes.length === 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={16} className="text-muted-foreground" />
              </div>
            )}
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-[300px] w-full translate-y-2 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            {!isSearching && searchResults.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No vehicles found.
              </div>
            ) : (
              <div className="p-1">
                {searchResults.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className="relative flex cursor-pointer select-none items-center gap-3 rounded-sm px-2 py-2 outline-none hover:bg-accent hover:text-accent-foreground"
                  >
                    {/* Simple Thumbnail */}
                    <div className="h-10 w-16 overflow-hidden rounded bg-muted/50">
                      <img
                        src={vehicle.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium">{vehicle.vehicleName}</span>
                      <span className="w-fit rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        {vehicle.vehicleCode}
                      </span>
                    </div>

                    <div className="ml-auto text-xs text-muted-foreground">
                      {vehicle.brandName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="flex justify-between px-1">
        <span className="text-xs text-muted-foreground">
          Selected: {selectedVehicleCodes.length} / {maxSelections}
        </span>
      </div>
    </div>
  );
}
