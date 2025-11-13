// components/dialog/PriceOfferDialog.tsx
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { LiveListingVehicleType } from "@/types/api-types/vehicleAPI-types";
import { toggleVehiclePriceOfferApi } from "@/api/listings";

interface PriceOfferDialogProps {
  vehicle: LiveListingVehicleType | null;
  onClose: () => void;
}

const DURATION_OPTIONS = [
  { value: "1", label: "1 Hour" },
  { value: "3", label: "3 Hours" },
  { value: "8", label: "8 Hours" },
  { value: "12", label: "12 Hours" },
  { value: "24", label: "24 Hours" },
  { value: "48", label: "48 Hours" },
  { value: "72", label: "72 Hours" },
];

const ALL_CYCLE_OPTIONS = [
  { value: "1", label: "1 Hour Loop" },
  { value: "4", label: "4 Hour Loop" },
  { value: "8", label: "8 Hour Loop" },
  { value: "12", label: "12 Hour Loop" },
  { value: "24", label: "24 Hour Loop" },
];

export default function PriceOfferDialog({
  vehicle,
  onClose,
}: PriceOfferDialogProps) {
  const queryClient = useQueryClient();

  const hasActiveOffer =
    vehicle?.priceOffer?.expiryTime &&
    new Date(vehicle.priceOffer.expiryTime) > new Date();

  const [durationHours, setDurationHours] = useState<string>("24");
  const [cycleDurationHours, setCycleDurationHours] = useState<string>("1");

  // Filter cycle options based on duration
  const availableCycleOptions = useMemo(() => {
    const duration = Number(durationHours);
    return ALL_CYCLE_OPTIONS.filter(
      (option) => Number(option.value) <= duration,
    );
  }, [durationHours]);

  // Reset form when dialog opens with existing offer
  useEffect(() => {
    if (vehicle?.priceOffer) {
      setDurationHours(String(vehicle.priceOffer.durationHours));
      setCycleDurationHours(String(vehicle.priceOffer.cycleDurationHours));
    } else {
      setDurationHours("24");
      setCycleDurationHours("1");
    }
  }, [vehicle]);

  // Auto-adjust cycle if it becomes invalid after duration change
  useEffect(() => {
    const currentCycle = Number(cycleDurationHours);
    const currentDuration = Number(durationHours);

    if (currentCycle > currentDuration) {
      // Reset to the maximum valid cycle (which is the duration itself)
      const maxValidCycle =
        availableCycleOptions[availableCycleOptions.length - 1];
      setCycleDurationHours(maxValidCycle?.value || "1");
    }
  }, [durationHours, cycleDurationHours, availableCycleOptions]);

  const { mutateAsync: toggleOffer, isPending } = useMutation({
    mutationFn: async (payload: {
      vehicleId: string;
      enabled: boolean;
      durationHours?: number;
      cycleDurationHours?: number;
    }) => {
      await toggleVehiclePriceOfferApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listings", "live-listings"],
      });
      toast({
        title: hasActiveOffer ? "Offer Removed" : "Offer Activated",
        description: hasActiveOffer
          ? "Price offer has been removed successfully."
          : "Price offer has been activated successfully.",
        className: "bg-yellow text-white",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error toggling price offer:", error);
      toast({
        variant: "destructive",
        title: "Failed to update price offer",
        description: "An error occurred while updating the price offer.",
      });
    },
  });

  const handleSubmit = async () => {
    if (!vehicle) return;

    if (hasActiveOffer) {
      await toggleOffer({
        vehicleId: vehicle.vehicleId,
        enabled: false,
      });
    } else {
      await toggleOffer({
        vehicleId: vehicle.vehicleId,
        enabled: true,
        durationHours: Number(durationHours),
        cycleDurationHours: Number(cycleDurationHours),
      });
    }
  };

  return (
    <Dialog open={!!vehicle} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mb-4">
            {hasActiveOffer ? "Manage" : "Configure"} Price Offer{" "}
            <span className="text-red-400">(Beta)</span>
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{vehicle?.vehicleModel}</span>
          </DialogDescription>
        </DialogHeader>

        {!hasActiveOffer && (
          <div className="grid gap-6 py-4">
            {/* Schedule Duration */}
            <div className="grid gap-2">
              <Label htmlFor="duration">Offer Duration</Label>
              <Select
                value={durationHours}
                onValueChange={setDurationHours}
                disabled={isPending}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How long the offer will be active on the platform
              </p>
            </div>

            {/* Loop/Cycle Duration */}
            <div className="grid gap-2">
              <Label htmlFor="cycle">Timer Loop Duration</Label>
              <Select
                value={cycleDurationHours}
                onValueChange={setCycleDurationHours}
                disabled={isPending}
              >
                <SelectTrigger id="cycle">
                  <SelectValue placeholder="Select cycle duration" />
                </SelectTrigger>
                <SelectContent>
                  {availableCycleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How often the countdown timer resets (max: {durationHours}h)
              </p>
            </div>
          </div>
        )}

        {hasActiveOffer && (
          <div className="py-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm">
              <p className="font-semibold text-green-800">
                ✓ Offer is currently active
              </p>
              <p className="mt-1 text-green-700">
                Duration: {vehicle?.priceOffer?.durationHours} hours
              </p>
              <p className="text-green-700">
                Loop: {vehicle?.priceOffer?.cycleDurationHours} hour cycles
              </p>
              <p className="mt-2 text-xs text-green-600">
                Expires:{" "}
                {new Date(
                  vehicle?.priceOffer?.expiryTime || "",
                ).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className={hasActiveOffer ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isPending
              ? "Processing..."
              : hasActiveOffer
                ? "Remove Offer"
                : "Enable Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
