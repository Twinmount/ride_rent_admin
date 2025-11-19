import { useEffect, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BrandType, CategoryType } from "@/types/api-types/API-types";
import { useFetchSeriesBrands } from "@/pages/vehicle-series/SeriesPage.hooks";
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

interface SeriesBrandDropdownProps {
  selectedCategory?: CategoryType | null;
  selectedBrand: BrandType | null;
  setSelectedBrand: (brand: BrandType | null) => void;
}

export default function SeriesBrandDropdown({
  selectedCategory,
  selectedBrand,
  setSelectedBrand,
}: SeriesBrandDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [open, setOpen] = useState(false);

  const { brands, isBrandsLoading } = useFetchSeriesBrands({
    vehicleCategoryId: selectedCategory?.categoryId as string,
    searchQuery: debouncedSearchTerm,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const handleBrandSelect = (brand: BrandType) => {
    setSelectedBrand(brand);
    setOpen(false); // Close dropdown after selection
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={isBrandsLoading || !selectedCategory}
          className="!h-8 w-fit max-w-fit cursor-pointer !rounded-lg bg-slate-800 text-white outline-none transition-colors hover:bg-slate-900 hover:text-white"
        >
          {!selectedCategory
            ? "Select Brand"
            : isBrandsLoading
              ? "Loading..."
              : selectedBrand?.brandName || "Select Brand"}
          <ChevronDown className="ml-2 h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 min-w-64 max-w-64 overflow-y-auto p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search Brand..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-b p-2"
          />
          <CommandList>
            {!searchTerm ? (
              <CommandEmpty>Please search the brand.</CommandEmpty>
            ) : isBrandsLoading ? (
              <CommandEmpty>Searching...</CommandEmpty>
            ) : brands.length === 0 ? (
              <CommandEmpty>No Brands Found</CommandEmpty>
            ) : (
              <CommandGroup>
                {/* clear selection */}
                {selectedBrand && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedBrand(null);
                    }}
                    className="mb-2 w-full cursor-pointer rounded-md border border-red-400/50 px-2 py-1 text-sm font-semibold text-red-400 hover:bg-red-100 hover:text-red-600"
                  >
                    Clear Selection
                  </button>
                )}
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.id}
                    onSelect={() => handleBrandSelect(brand)}
                    className={cn(
                      "cursor-pointer font-semibold",
                      selectedBrand?.id === brand.id
                        ? "bg-slate-800 text-white"
                        : "hover:bg-slate-200",
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBrand?.id === brand.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {brand.brandName}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
