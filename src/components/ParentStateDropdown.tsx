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
import { ParentState } from "@/types/types";
import { ChevronDown, Plus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface IndianStateDropdownProps {
  parentStatesList: ParentState[];
  parentState: ParentState;
  setParentState: (value: ParentState) => void;
  isLoading: boolean;
}

export function ParentStateDropdown({
  parentStatesList,
  parentState,
  setParentState,
  isLoading,
}: IndianStateDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button variant="outline" className="shadow-lg">
          State : {parentState.stateName}
          <ChevronDown size={17} className="my-auto ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel>Select State</DropdownMenuLabel>
          <Link
            to={"add"}
            onClick={(e) => e.stopPropagation()} // Prevent dropdown close
            className="text-muted-foreground hover:text-primary"
          >
            <Plus size={16} />
          </Link>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={parentState.stateId}
          onValueChange={(stateId) => {
            const selectedState = parentStatesList.find(
              (state) => state.stateId === stateId,
            );
            if (selectedState) {
              localStorage.setItem(
                "parentState",
                JSON.stringify(selectedState),
              );
              setParentState(selectedState);
            }
          }}
        >
          {parentStatesList.map((state) => (
            <div
              key={state.stateId}
              className="flex items-center justify-between"
            >
              <DropdownMenuRadioItem value={state.stateId} className="flex-1">
                {state.stateName}
              </DropdownMenuRadioItem>
              <Link
                to={`edit/${state.stateId}`}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown close
                className="pr-2 text-muted-foreground hover:text-primary"
              >
                <Pencil size={14} />
              </Link>
            </div>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
