

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Calendar, DollarSign, Percent, Settings } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { CouponType, StateAvailability, createCoupon, updateCoupon } from "@/api/coupen";
import { fetchAllStates } from "@/api/states";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  coupon?: CouponType;
  countryId: string;
  countryValue?: string;
}

interface StateOption {
  stateId: string;
  stateName: string;
}

// Format date to YYYY-MM-DD
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CouponFormModal({
  isOpen,
  onClose,
  onSuccess,
  coupon,
  countryId,
  countryValue = "IN",
}: CouponFormModalProps) {
  const isEditMode = !!coupon;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get currency symbol based on country code
  const getCurrencySymbol = () => {
    return countryValue === "UAE" ? "AED" : "₹";
  };

  const currencySymbol = getCurrencySymbol();

  // Form state
  const [formData, setFormData] = useState({
    couponName: "",
    couponCode: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 0,
    maxDiscountAmount: "",
    minOrderValue: 0,
    description: "",
    termsAndConditions: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    usageLimitPerUser: "",
    isVisibleOnCard: false,
    isFirstTimeUserOnly: false,
    priority: 0,
  });

  const [stateAvailability, setStateAvailability] = useState<StateAvailability[]>([]);
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]);

  // Fetch states using React Query
  const { data: statesData, isLoading: loadingStates } = useQuery({
    queryKey: ["all-states", countryId],
    queryFn: () => fetchAllStates(countryId, false, null, null, null, null),
    enabled: !!countryId && isOpen,
  });

  // Compute availableStates from query data
  const availableStates: StateOption[] = useMemo(() => {
    if (!statesData?.result) return [];
    
    return statesData.result.map((state: any) => ({
      stateId: state.stateId,
      stateName: state.stateName,
    }));
  }, [statesData]);

  // Load coupon data if editing
  useEffect(() => {
    if (coupon) {
      setFormData({
        couponName: coupon.couponName,
        couponCode: coupon.couponCode,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
        minOrderValue: coupon.minOrderValue,
        description: coupon.description || "",
        termsAndConditions: coupon.termsAndConditions || "",
        startDate: formatDate(coupon.startDate),
        endDate: formatDate(coupon.endDate),
        usageLimit: coupon.usageLimit?.toString() || "",
        usageLimitPerUser: coupon.usageLimitPerUser?.toString() || "",
        isVisibleOnCard: coupon.isVisibleOnCard,
        isFirstTimeUserOnly: coupon.isFirstTimeUserOnly,
        priority: coupon.priority,
      });
      setStateAvailability(coupon.stateAvailability);
      setSelectedStateIds(coupon.stateAvailability.map(s => s.stateId));
    } else {
      resetForm();
    }
  }, [coupon, isOpen]);

  const resetForm = () => {
    setFormData({
      couponName: "",
      couponCode: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxDiscountAmount: "",
      minOrderValue: 0,
      description: "",
      termsAndConditions: "",
      startDate: "",
      endDate: "",
      usageLimit: "",
      usageLimitPerUser: "",
      isVisibleOnCard: false,
      isFirstTimeUserOnly: false,
      priority: 0,
    });
    setStateAvailability([]);
    setSelectedStateIds([]);
  };

  const handleStateToggle = (stateId: string) => {
    const state = availableStates.find(s => s.stateId === stateId);
    if (!state) return;

    if (selectedStateIds.includes(stateId)) {
      setSelectedStateIds(selectedStateIds.filter(id => id !== stateId));
      setStateAvailability(stateAvailability.filter(s => s.stateId !== stateId));
    } else {
      setSelectedStateIds([...selectedStateIds, stateId]);
      setStateAvailability([
        ...stateAvailability,
        {
          stateId: state.stateId,
          stateName: state.stateName,
          isEnabled: true,
        },
      ]);
    }
  };

  const handleToggleStateEnabled = (stateId: string) => {
    setStateAvailability(
      stateAvailability.map((s) =>
        s.stateId === stateId ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  };

  const handleSelectAllStates = () => {
    if (selectedStateIds.length === availableStates.length) {
      setSelectedStateIds([]);
      setStateAvailability([]);
    } else {
      const allStateIds = availableStates.map(s => s.stateId);
      setSelectedStateIds(allStateIds);
      setStateAvailability(
        availableStates.map(s => ({
          stateId: s.stateId,
          stateName: s.stateName,
          isEnabled: true,
        }))
      );
    }
  };

  const handleSubmit = async () => {
    if (!formData.couponName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Coupon name is required",
      });
      return;
    }

    if (!formData.couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Coupon code is required",
      });
      return;
    }

    if (formData.discountValue <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Discount value must be greater than 0",
      });
      return;
    }

    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Percentage discount cannot exceed 100%",
      });
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Start and end dates are required",
      });
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "End date must be after start date",
      });
      return;
    }

    if (stateAvailability.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least one state must be selected",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        couponName: formData.couponName,
        couponCode: formData.couponCode.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : undefined,
        minOrderValue: formData.minOrderValue,
        description: formData.description || undefined,
        termsAndConditions: formData.termsAndConditions || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
        usageLimitPerUser: formData.usageLimitPerUser
          ? Number(formData.usageLimitPerUser)
          : undefined,
        isVisibleOnCard: formData.isVisibleOnCard,
        isFirstTimeUserOnly: formData.isFirstTimeUserOnly,
        priority: formData.priority,
        countryId,
        stateAvailability,
      };

      if (isEditMode) {
        await updateCoupon({
          couponId: coupon._id,
          ...payload,
        });
        toast({
          title: "Success",
          description: "Coupon updated successfully",
          className: "bg-green-500 text-white",
        });
      } else {
        await createCoupon(payload);
        toast({
          title: "Success",
          description: "Coupon created successfully",
          className: "bg-green-500 text-white",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving coupon:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} coupon`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditMode ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the coupon details below"
              : "Fill in the details to create a new promotional coupon"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couponName">
                    Coupon Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="couponName"
                    value={formData.couponName}
                    onChange={(e) =>
                      setFormData({ ...formData, couponName: e.target.value })
                    }
                    placeholder="e.g., Summer Sale 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="couponCode">
                    Coupon Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="couponCode"
                    value={formData.couponCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        couponCode: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="e.g., SUMMER50"
                    className="font-mono"
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Customer-facing description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.termsAndConditions}
                  onChange={(e) =>
                    setFormData({ ...formData, termsAndConditions: e.target.value })
                  }
                  placeholder="Legal terms and conditions"
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Discount Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">
                    Discount Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Percentage (%)
                        </div>
                      </SelectItem>
                      <SelectItem value="FIXED">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Fixed Amount ({currencySymbol})
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Discount Value <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: Number(e.target.value),
                      })
                    }
                    min="0"
                    max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.discountType === "PERCENTAGE" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscount">
                      Max Discount Amount ({currencySymbol})
                    </Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxDiscountAmount: e.target.value,
                        })
                      }
                      placeholder="Optional cap on discount"
                      min="0"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="minOrder">
                    Minimum Order Value ({currencySymbol})
                  </Label>
                  <Input
                    id="minOrder"
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minOrderValue: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Validity Period
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Usage Limits</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Total Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, usageLimit: e.target.value })
                    }
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usageLimitPerUser">Usage Limit Per User</Label>
                  <Input
                    id="usageLimitPerUser"
                    type="number"
                    value={formData.usageLimitPerUser}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimitPerUser: e.target.value,
                      })
                    }
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  State Availability <span className="text-red-500">*</span>
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllStates}
                  disabled={loadingStates || availableStates.length === 0}
                >
                  {selectedStateIds.length === availableStates.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              {loadingStates ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading states...
                </div>
              ) : availableStates.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No states available for this country
                </div>
              ) : (
                <div className="border rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {availableStates.map((state) => {
                    const isSelected = selectedStateIds.includes(state.stateId);
                    const stateAvail = stateAvailability.find(
                      (s) => s.stateId === state.stateId
                    );

                    return (
                      <div
                        key={state.stateId}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleStateToggle(state.stateId)}
                          />
                          {isSelected && (
                            <Switch
                              checked={stateAvail?.isEnabled ?? true}
                              onCheckedChange={() =>
                                handleToggleStateEnabled(state.stateId)
                              }
                            />
                          )}
                          <span
                            className={`${
                              isSelected && stateAvail?.isEnabled
                                ? "text-green-600 font-medium"
                                : isSelected && !stateAvail?.isEnabled
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {state.stateName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedStateIds.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedStateIds.length} state(s)
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Settings</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Visible on Vehicle Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Show coupon tag on vehicle listings
                    </p>
                  </div>
                  <Switch
                    checked={formData.isVisibleOnCard}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isVisibleOnCard: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>First-Time Users Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict to users who haven't used any coupon before
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFirstTimeUserOnly}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFirstTimeUserOnly: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority (Higher = More Prominent)</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: Number(e.target.value) })
                    }
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Coupon"
                : "Create Coupon"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}