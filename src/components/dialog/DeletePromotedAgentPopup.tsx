import { removePromotedCompany } from "@/api/company";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

type SelectedAgentType = {
  companyId: string;
  stateId: string;
  categoryId: string;
} | null;

type PropType = {
  isOpen: boolean;
  onClose: () => void;
  selectedAgentForDelete: SelectedAgentType;
};

export default function DeletePromotedAgentPopup({
  isOpen,
  onClose,
  selectedAgentForDelete,
}: PropType) {
  const [isDialogVisible, setIsDialogVisible] = useState(isOpen);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const companyId = selectedAgentForDelete?.companyId || "";
  const stateId = selectedAgentForDelete?.stateId || "";
  const categoryId = selectedAgentForDelete?.categoryId || "";

  useEffect(() => {
    setIsDialogVisible(isOpen); // Sync with external state when it changes
  }, [isOpen]);

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
    <Dialog
      open={isDialogVisible}
      onOpenChange={(open) => {
        if (!open) {
          setIsDialogVisible(false);
          setTimeout(onClose, 300); // Delay clearing state
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to remove this agent from promoted list?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div></div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={() => {
            mutation.mutate();
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
