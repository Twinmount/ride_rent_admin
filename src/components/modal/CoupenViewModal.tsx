import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CouponType } from "@/api/coupen";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  DollarSign,
  Percent,
  Users,
  MapPin,
  TrendingUp,
  Tag,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface CouponViewModalProps {
  coupon: CouponType;
  isOpen: boolean;
  onClose: () => void;
}

export default function CouponViewModal({
  coupon,
  isOpen,
  onClose,
}: CouponViewModalProps) {
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

  const enabledStates = coupon.stateAvailability.filter((s) => s.isEnabled);
  const disabledStates = coupon.stateAvailability.filter((s) => !s.isEnabled);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {coupon.couponName}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span className="font-mono font-semibold text-primary text-lg">
                  {coupon.couponCode}
                </span>
                <Badge className={getStatusColor(coupon.status)} variant="outline">
                  {coupon.status}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Discount Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Discount Details
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {coupon.discountType === "PERCENTAGE" ? (
                      <Percent className="h-4 w-4" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                    Discount Type
                  </p>
                  <p className="font-semibold text-lg">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </p>
                </div>

                {coupon.discountType === "PERCENTAGE" &&
                  coupon.maxDiscountAmount && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Max Discount
                      </p>
                      <p className="font-semibold text-lg">
                        ₹{coupon.maxDiscountAmount}
                      </p>
                    </div>
                  )}

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Min Order Value
                  </p>
                  <p className="font-semibold">₹{coupon.minOrderValue}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="font-mono">
                    {coupon.priority}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Validity Period */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Validity Period
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {format(new Date(coupon.startDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(coupon.startDate), "hh:mm a")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {format(new Date(coupon.endDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(coupon.endDate), "hh:mm a")}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Usage Statistics */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Usage Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Used</p>
                  <p className="font-semibold text-xl">{coupon.usageCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Limit</p>
                  <p className="font-semibold text-xl">
                    {coupon.usageLimit || "∞"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Per User</p>
                  <p className="font-semibold text-xl">
                    {coupon.usageLimitPerUser || "∞"}
                  </p>
                </div>
              </div>

              {coupon.usageLimit && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        (coupon.usageCount / coupon.usageLimit) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (coupon.usageCount / coupon.usageLimit) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* State Availability */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                State Availability
              </h3>
              
              {enabledStates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Enabled States</p>
                  <div className="flex flex-wrap gap-2">
                    {enabledStates.map((state) => (
                      <Badge
                        key={state.stateId}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {state.stateName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {disabledStates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Disabled States</p>
                  <div className="flex flex-wrap gap-2">
                    {disabledStates.map((state) => (
                      <Badge
                        key={state.stateId}
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        {state.stateName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Additional Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Additional Settings
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      coupon.isVisibleOnCard ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm">
                    {coupon.isVisibleOnCard ? "Visible" : "Hidden"} on Cards
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      coupon.isFirstTimeUserOnly
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm">
                    {coupon.isFirstTimeUserOnly ? "First-time" : "All"} Users
                  </span>
                </div>
              </div>
            </div>

            {/* Categories & Companies */}
            {(coupon.applicableVehicleCategories.length > 0 ||
              coupon.applicableCompanies.length > 0 ||
              coupon.excludedVehicleCategories.length > 0 ||
              coupon.excludedCompanies.length > 0) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Restrictions</h3>
                  
                  {coupon.applicableVehicleCategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Applicable Vehicle Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coupon.applicableVehicleCategories.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {coupon.excludedVehicleCategories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Excluded Vehicle Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {coupon.excludedVehicleCategories.map((cat) => (
                          <Badge key={cat} variant="destructive">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Description & Terms */}
            {(coupon.description || coupon.termsAndConditions) && (
              <>
                <Separator />
                <div className="space-y-3">
                  {coupon.description && (
                    <div className="space-y-2">
                      <p className="font-medium">Description</p>
                      <p className="text-sm text-muted-foreground">
                        {coupon.description}
                      </p>
                    </div>
                  )}

                  {coupon.termsAndConditions && (
                    <div className="space-y-2">
                      <p className="font-medium">Terms & Conditions</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {coupon.termsAndConditions}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Metadata */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>
                  {format(new Date(coupon.createdAt), "MMM dd, yyyy hh:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>
                  {format(new Date(coupon.updatedAt), "MMM dd, yyyy hh:mm a")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Coupon ID:</span>
                <span className="font-mono">{coupon._id}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}