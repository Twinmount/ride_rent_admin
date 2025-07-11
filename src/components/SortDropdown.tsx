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
import { ArrowDownWideNarrow, ChevronDown } from "lucide-react";

type SortOrder = "ASC" | "DESC";

interface SortDropdownProps {
  sortOrder: SortOrder;
  setSortOrder: (value: SortOrder) => void;
  isLoading: boolean;
}

export function SortDropdown({
  sortOrder,
  setSortOrder,
  isLoading,
}: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="flex-center gap-x-2 shadow-lg">
          <ArrowDownWideNarrow size={18} />{" "}
          {sortOrder === "ASC" ? "Asc" : "Desc"}{" "}
          <ChevronDown size={17} className="my-auto ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as SortOrder)}
        >
          <DropdownMenuRadioItem value="ASC">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="DESC">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
