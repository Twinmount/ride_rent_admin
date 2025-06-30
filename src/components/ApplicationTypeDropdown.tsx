import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApplicationTypes } from "@/types/types";
import { ChevronDown } from "lucide-react";

interface ApplicationTypeDropdownProps {
  type: ApplicationTypes;
  setType: (value: ApplicationTypes) => void;
  isLoading: boolean;
}

export function ApplicationTypeDropdown({
  type,
  setType,
  isLoading,
}: ApplicationTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="shadow-lg">
          <span>Application Type: </span>
          <span className="ms-1 capitalize">{type}</span>
          <ChevronDown size={17} className="my-auto ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuRadioGroup
          value={type.toString()}
          onValueChange={(value) => setType(value as ApplicationTypes)}
        >
          <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="career">Career</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="intern">Intern</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
