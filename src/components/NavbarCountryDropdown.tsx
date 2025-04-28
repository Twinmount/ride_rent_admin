import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAdminContext } from "@/context/AdminContext";
import { countryType } from "@/types/types";

import { ChevronDown, Globe } from "lucide-react";

type DropdownProps = {
  options: countryType[];
  isLoading: boolean;
};

const NavbarCountryDropdown = ({ options, isLoading }: DropdownProps) => {
  const { country, setCountry } = useAdminContext();

  const handleSelect = (option: countryType) => {
    const { countryName, countryValue, countryId } = option;
    setCountry({ countryName, countryValue, countryId });
    localStorage.setItem("selectedCountry", JSON.stringify(country));
    localStorage.removeItem("selectedState");
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`w-fit min-w-32 cursor-pointer !border-none !outline-none ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
        disabled={isLoading}
      >
        <div className="relative flex h-10 items-center whitespace-nowrap rounded-3xl pl-4 pr-1 font-semibold tracking-wider outline">
          <Globe className="mr-2 text-yellow" size={20} />
          {isLoading
            ? "Loading..."
            : country?.countryName || "Select a country"}
          {!isLoading && (
            <ChevronDown className="relative top-1 ml-1" width={15} />
          )}
          {/* Render NotificationIndicator in DropdownMenuTrigger */}
        </div>
      </DropdownMenuTrigger>

      {!isLoading && options?.length > 0 && (
        <DropdownMenuContent className="ml-8 w-40">
          <DropdownMenuLabel className="mb-2 bg-slate-100 font-bold">
            Choose country
          </DropdownMenuLabel>
          {options.map((option) => (
            <DropdownMenuGroup key={option.countryId}>
              <DropdownMenuItem
                onClick={() => handleSelect(option)}
                className={`relative flex cursor-pointer items-center justify-between font-semibold ${
                  option.countryValue === country?.countryValue
                    ? "bg-slate-900 !text-white hover:!bg-slate-900"
                    : "text-black hover:!bg-gray-300"
                }`}
              >
                {option.countryName}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default NavbarCountryDropdown;
