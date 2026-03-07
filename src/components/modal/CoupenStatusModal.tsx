import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CouponType } from "@/api/coupen";
import { Badge } from "@/components/ui/badge";

interface CouponStatusModalProps {
  coupon: CouponType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newStatus: "ACTIVE" | "INACTIVE" | "EXPIRED") => Promise<void>;
}

export default function CouponStatusModal({
  coupon,
  isOpen,
  onClose,
  onSubmit,
}: CouponStatusModalProps) {
  const [newStatus, setNewStatus] = useState<
    "ACTIVE" | "INACTIVE" | "EXPIRED"
  >(coupon.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newStatus === coupon.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(newStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "INACTIVE":
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20";
      case "EXPIRED":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Coupon Status</DialogTitle>
          <DialogDescription>
            Update the status of coupon{" "}
            <span className="font-mono font-semibold text-primary">
              {coupon.couponCode}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Coupon Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Coupon Name:
              </span>
              <span className="font-medium">{coupon.couponName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Current Status:
              </span>
              <Badge className={getStatusColor(coupon.status)} variant="outline">
                {coupon.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Usage Count:
              </span>
              <span className="font-medium">
                {coupon.usageCount}
                {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select
              value={newStatus}
              onValueChange={(value: any) => setNewStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Active</span>
                  </div>
                </SelectItem>
                <SelectItem value="INACTIVE">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Inactive</span>
                  </div>
                </SelectItem>
                <SelectItem value="EXPIRED">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Expired</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warning Messages */}
          {newStatus === "INACTIVE" && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Setting the coupon to INACTIVE will prevent users from
                applying it to orders.
              </p>
            </div>
          )}

          {newStatus === "EXPIRED" && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                🚫 Setting the coupon to EXPIRED is permanent. The coupon will
                no longer be usable.
              </p>
            </div>
          )}

          {newStatus === "ACTIVE" && coupon.status !== "ACTIVE" && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Activating this coupon will allow users to apply it to their
                orders.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || newStatus === coupon.status}
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}