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
  stateCategoryInfo: {
    stateId: string;
    categoryId: string;
  } | null;
};

export default function AddPromotedAgentPopup({
  isOpen,
  onClose,
  stateCategoryInfo,
}: PropType) {
  const [selectedCompany, setSelectedCompany] =
    useState<promotedCompanyType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const stateId = stateCategoryInfo?.stateId || "";
  const categoryId = stateCategoryInfo?.categoryId || "";

  // Mutation for adding promoted company
  const mutation = useMutation({
    mutationFn: () => {
      if (!selectedCompany) {
        setError("Please select a company first.");
        return Promise.reject();
      }
      return addPromotedCompany({
        companyId: selectedCompany.companyId,
        state: stateId,
        category: categoryId,
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
          selectedCompanyId={selectedCompany?.companyId}
        />

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

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
