import { removePromotedCompany } from "@/api/company";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useState } from "react";

type PropType = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  stateId: string;
  categoryId: string;
};

export default function DeletePromotedAgentPopup({
  isOpen,
  onClose,
  companyId,
  stateId,
  categoryId,
}: PropType) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // React Query mutation for delete operation
  const mutation = useMutation({
    mutationFn: () => removePromotedCompany({ companyId, stateId, categoryId }),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["promoted-companies"] });
      onClose();
    },
    onError: (err) => {
      console.error("Error deleting agent:", err);
      setError(
        "Failed to remove the agent from promotion list. Please try again.",
      );
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to remove this agent from promoted list?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={() => {
            mutation.mutate();
            console.log("Removing", { companyId, stateId, categoryId });
          }}
          className="rounded bg-red-500 px-4 py-2 text-white disabled:bg-gray-400"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Removing..." : "Remove"}
        </button>
      </DialogContent>
    </Dialog>
  );
}
