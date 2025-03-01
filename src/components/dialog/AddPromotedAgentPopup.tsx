import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPromotedCompany } from "@/api/company";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { promotedCompanyType } from "@/types/api-types/API-types";
import PromotedCompanySearchDropdown from "../PromotedCompanySearchDropdown";

type PropType = {
  isOpen: boolean;
  onClose: () => void;
  stateId: string;
  categoryId: string;
};

export default function AddPromotedAgentPopup({
  isOpen,
  onClose,
  stateId,
  categoryId,
}: PropType) {
  const [selectedCompany, setSelectedCompany] =
    useState<promotedCompanyType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Mutation for adding promoted company
  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedCompany) {
        setError("Please select a company first.");
        return Promise.reject();
      }
      return addPromotedCompany({
        companyId: selectedCompany.companyId,
        stateId,
        categoryId,
      });
    },
    onSuccess: () => {
      setError(null);
      setSelectedCompany(null);
      queryClient.invalidateQueries({ queryKey: ["promoted-companies"] });
      onClose();
    },
    onError: (err) => {
      console.error("Error adding agent:", err);
      setError("Failed to add agent to promotion list. Please try again.");
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setSelectedCompany(null);
        setError(null);
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Agent to Promoted List</DialogTitle>
          <DialogDescription>
            Search and Select a company to add to the promotion list.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input & Dropdown */}
        <PromotedCompanySearchDropdown
          onSelect={(company) => setSelectedCompany(company)}
        />

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Selected Company Info */}
        {selectedCompany && (
          <div className="mt-2 flex items-center gap-3 border-t pt-2">
            <img
              src={selectedCompany.companyLogo}
              alt={selectedCompany.companyName}
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm">{selectedCompany.companyName}</span>
          </div>
        )}

        <button
          onClick={() => mutation.mutate()}
          className="mt-3 w-full rounded bg-yellow px-4 py-2 text-white disabled:bg-gray-400"
          disabled={mutation.isPending || !selectedCompany}
        >
          {mutation.isPending ? "Adding..." : "Add"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
