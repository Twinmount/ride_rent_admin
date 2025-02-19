import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import VehicleSeriesForm from "@/components/form/VehicleSeriesForm";

type VehicleSeriesDialogProps = {
  series: any;
  brandId: string;
  onClose: () => void; // Callback to handle dialog close
  open: boolean; // State to control dialog visibility
};

const VehicleSeriesDialog = ({
  series,
  brandId,
  onClose,
  open,
}: VehicleSeriesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="h-full max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle Series</DialogTitle>
          <DialogDescription className="text-red-500">
            Double check the spelling before saving as it affects the URL .
          </DialogDescription>
        </DialogHeader>
        {series && (
          <ScrollArea className="h-full max-h-[90vh]">
            <VehicleSeriesForm
              type="Update"
              formData={series}
              onSuccess={onClose} // Call `onClose` after form success
              brandId={brandId}
            />
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSeriesDialog;
