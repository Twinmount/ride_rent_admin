import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SRMCompletedTripType } from "@/types/api-types/srm-api.types";

type CompletedTripReceiptDownloadDialogProps = {
  tripData: SRMCompletedTripType | null;
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (tripData: SRMCompletedTripType) => Promise<void>;
};

export default function CompletedTripReceiptDownloadDialog({
  tripData,
  isOpen,
  onClose,
  onSubmit,
}: CompletedTripReceiptDownloadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Receipt</DialogTitle>
          <DialogDescription>
            Do you want to download the receipt for this trip?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} className="px-4 py-2">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(tripData as SRMCompletedTripType)}
            className="hover:bg-darkYellow bg-yellow px-4 py-2 text-white"
          >
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
