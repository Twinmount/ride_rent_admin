import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LimitType } from "@/types/types";
import { ChevronDown } from "lucide-react";

interface LimitDropdownProps {
  limit: LimitType;
  setLimit: (value: LimitType) => void;
  isLoading: boolean;
}

export function LimitDropdown({
  limit,
  setLimit,
  isLoading,
}: LimitDropdownProps) {
  const limits = [
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
    { value: 30, label: "30" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="shadow-lg">
          Limit: {limit} <ChevronDown size={17} className="my-auto ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Select Limit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={limit.toString()}
          onValueChange={(value) => setLimit(Number(value) as LimitType)}
        >
          {limits.map((limit) => (
            <DropdownMenuRadioItem
              key={limit.value}
              value={limit.value.toString()}
            >
              {limit.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
