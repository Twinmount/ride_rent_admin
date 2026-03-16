import { useState } from "react";
import { UserRound, ChevronDown, Plus, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import PreviewImageComponent from "@/components/form/PreviewImageComponent";
import AddManagerDialog from "@/components/dialog/AddManagerDialog";
import { useManagers } from "@/hooks/useManagers";
import type { Manager } from "@/types/manager-types";

type ManagerDropdownProps = {
  agentId: string;
  value: string; // The selected manager's ID
  onChangeHandler: (managerId: string) => void;
  isDisabled?: boolean;
};

/**
 * ManagerDropdown
 *
 * A popover-based selector for assigning a manager to a vehicle.
 * Allows selecting an existing manager or opening the AddManagerDialog inline.
 */
export default function ManagerDropdown({
  agentId,
  value,
  onChangeHandler,
  isDisabled = false,
}: ManagerDropdownProps) {
  const [open, setOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: managersData, isLoading } = useManagers(agentId);
  const managers: Manager[] = Array.isArray(managersData) ? managersData : [];

  const selectedManager: Manager | undefined = managers.find((m) => m.id === value);

  const handleSelect = (managerId: string) => {
    onChangeHandler(managerId);
    setOpen(false);
  };

  const handleAddManagerSuccess = () => {
    setIsAddDialogOpen(false);
    // Dropdown remains open so the user can pick the newly added manager.
    setOpen(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={isDisabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={isDisabled}
            className="input-field flex w-full items-center gap-3 text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedManager ? (
              <>
                <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-lg border border-yellow/30">
                  {selectedManager.profilePicture ? (
                    <PreviewImageComponent imagePath={selectedManager.profilePicture} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-yellow/10">
                      <UserRound className="h-4 w-4 text-yellow" />
                    </div>
                  )}
                </div>
                <span className="flex-1 truncate text-sm font-medium text-gray-900">
                  {selectedManager.name}
                </span>
              </>
            ) : (
              <span className="flex-1 text-sm text-gray-400">
                {isLoading ? "Loading managers..." : "Select a manager"}
              </span>
            )}
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ui-open:rotate-180" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-2 rounded-xl shadow-xl border border-gray-100" align="start">
          {/* Manager List */}
          <div className="max-h-56 overflow-y-auto space-y-1">
            {isLoading && (
              <p className="p-3 text-sm text-gray-400 text-center">Loading…</p>
            )}
            {!isLoading && managers.length === 0 && (
              <p className="p-3 text-sm text-gray-400 text-center">No managers yet.</p>
            )}
            {!isLoading &&
              managers.map((manager) => (
                <button
                  key={manager.id}
                  type="button"
                  onClick={() => handleSelect(manager.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 border-none outline-none"
                >
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100">
                    {manager.profilePicture ? (
                      <PreviewImageComponent imagePath={manager.profilePicture} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-yellow/10">
                        <UserRound className="h-4 w-4 text-yellow" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{manager.name}</p>
                  </div>
                  {value === manager.id && (
                    <Check className="h-4 w-4 flex-shrink-0 text-yellow" />
                  )}
                </button>
              ))}
          </div>

          {/* Divider + Add New */}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                setIsAddDialogOpen(true);
              }}
              className="w-full justify-start gap-2 rounded-lg text-sm font-medium text-yellow hover:text-yellow hover:bg-yellow/10"
            >
              <Plus className="h-4 w-4" />
              Add New Manager
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Inline Add Manager Dialog */}
      <AddManagerDialog
        open={isAddDialogOpen}
        onOpenChange={handleAddManagerSuccess}
        agentId={agentId}
      />
    </>
  );
}
